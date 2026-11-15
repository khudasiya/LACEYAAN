import zipfile
import os

SHOPIFY_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def create_theme_zip(output_filename):
    zip_path = os.path.join(ROOT_DIR, output_filename)
    if os.path.exists(zip_path):
        os.remove(zip_path)
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for folder in SHOPIFY_DIRS:
            folder_path = os.path.join(ROOT_DIR, folder)
            if not os.path.exists(folder_path):
                continue
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, ROOT_DIR)
                    zf.write(full_path, rel_path)
    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"Created {output_filename}: {size_mb:.2f} MB")

create_theme_zip('laceyaan-store-theme.zip')
create_theme_zip('laceyaan-complete-store-theme.zip')
