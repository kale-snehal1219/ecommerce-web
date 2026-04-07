import urllib.request
import json
import os

files = {
    "shenkhat.jpg": "File:Soil.jpg",
    "shengdana_pend.jpg": "File:Peanuts.jpg",
    "karanja_pend.jpg": "File:Seed.jpg",
    "erandi_pend.jpg": "File:Beans.jpg"
}

out_dir = r"c:\Users\Abhishek\OneDrive\Desktop\Abhi\E_commerce\assets\images"

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for out_name, file_title in files.items():
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={file_title}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(api_url, headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        pages = data['query']['pages']
        for page_id in pages:
            image_info = pages[page_id].get('imageinfo', [])
            if image_info:
                img_url = image_info[0]['url']
                print(f"Downloading {img_url} to {out_name}")
                req_img = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(req_img) as img_resp:
                    out_path = os.path.join(out_dir, out_name)
                    with open(out_path, 'wb') as f:
                        f.write(img_resp.read())
            else:
                print(f"Could not find URL for {file_title}")

