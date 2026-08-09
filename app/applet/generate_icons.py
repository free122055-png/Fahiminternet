import os
import struct
import zlib

def make_png(width, height, color=(37, 99, 235, 255)):
    row = b'\x00' + bytes(color * width)
    raw_data = row * height
    compressed_data = zlib.compress(raw_data)
    
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed_data) + chunk(b'IEND', b'')

densities = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

base_dir = 'android/app/src/main/res'
for folder, size in densities.items():
    dir_path = os.path.join(base_dir, folder)
    os.makedirs(dir_path, exist_ok=True)
    
    # Generate ic_launcher.png (Solid blue with white center or clean blue)
    png_data = make_png(size, size, (37, 99, 235, 255))
    with open(os.path.join(dir_path, 'ic_launcher.png'), 'wb') as f:
        f.write(png_data)
        
    # Generate ic_launcher_round.png
    with open(os.path.join(dir_path, 'ic_launcher_round.png'), 'wb') as f:
        f.write(png_data)
        
    # Generate ic_launcher_foreground.png
    with open(os.path.join(dir_path, 'ic_launcher_foreground.png'), 'wb') as f:
        f.write(png_data)

print("All launcher icons successfully generated!")
