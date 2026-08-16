#!/bin/bash
set -e
mkdir -p /tmp/jdk21
if [ ! -f /tmp/jdk-21_linux-x64_bin.tar.gz ]; then
  echo "Downloading JDK 21..."
  curl -sSL "https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.tar.gz" -o /tmp/jdk-21_linux-x64_bin.tar.gz
fi
echo "Extracting JDK 21..."
tar -xz -f /tmp/jdk-21_linux-x64_bin.tar.gz -C /tmp/jdk21 --strip-components=1

export JAVA_HOME=/tmp/jdk21
export PATH=$JAVA_HOME/bin:$PATH
java -version

echo "Building web assets & syncing Capacitor..."
npm run build
npx cap sync android

echo "Ensuring valid gradle-wrapper.jar and updating manifest..."
rm -f android/gradle/wrapper/gradle-wrapper.jar
curl -sSL "https://raw.githubusercontent.com/gradle/gradle/v8.11.1/gradle/wrapper/gradle-wrapper.jar" -o android/gradle/wrapper/gradle-wrapper.jar

python3 -c '
import zipfile, os
jar_path = "android/gradle/wrapper/gradle-wrapper.jar"
tmp_dir = "/tmp/gw_unzip"
if os.path.exists(tmp_dir):
    import shutil
    shutil.rmtree(tmp_dir)
os.makedirs(tmp_dir, exist_ok=True)
with zipfile.ZipFile(jar_path, "r") as zf:
    zf.extractall(tmp_dir)
manifest_path = os.path.join(tmp_dir, "META-INF", "MANIFEST.MF")
os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
with open(manifest_path, "w") as f:
    f.write("Manifest-Version: 1.0\nMain-Class: org.gradle.wrapper.GradleWrapperMain\nImplementation-Title: Gradle Wrapper\n")
with zipfile.ZipFile(jar_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(tmp_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, tmp_dir)
            zf.write(full_path, rel_path)
print("Gradle wrapper jar updated successfully.")
'

echo "Compiling Android App Bundle (AAB)..."
cd android
chmod +x ./gradlew
./gradlew --version
./gradlew bundleRelease --no-daemon

echo "Checking AAB output..."
ls -lh app/build/outputs/bundle/release/*.aab
