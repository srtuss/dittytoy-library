VERSION_STR = 'The Dittytoy Library v1.0'
OUTPUT_FILE = 'minified.js'

import re, glob, os
from pathlib import Path

TEMP_DIR = Path('../_temp')
os.makedirs(TEMP_DIR, exist_ok=True)

def iter_replace(string:str, old:str, new:str):
    while True:
        a = len(string)
        string = string.replace(old, new)
        if len(string) == a:
            break
    return string

output_code = []
code_files = glob.glob('src/*.js')
code_files.sort(key=lambda f: 'utils' in f, reverse=True)
for item in code_files:
    with open(item, 'r') as f:
        code = f.read()
        code = re.sub(r'\/\*[\s\S]*?\*\/', '', code)
        code = re.sub(r'\/\/.*', '', code)
        code = code.strip()
        code = iter_replace(code, '\n\n', '\n') # remove empty lines
        code = code.replace('\n', ' ').replace('\t', ' ')
        code = iter_replace(code, '  ', ' ') # remove extra whitespace

        while True:
            a = len(code)
            spaces = reversed(list(re.finditer(r'\w +\W|\W +\w|\W +\W', code)))
            for space in spaces:
                start, stop = space.regs[0]
                code = code[:start+1] + code[stop-1:]
            if len(code) == a:
                break
        
        with open(TEMP_DIR / Path(item).name, 'w') as f:
            f.write(code)
        output_code.append(code)

with open(OUTPUT_FILE, 'w') as f:
    print(f'// {VERSION_STR} - https://github.com/srtuss/dittytoy-library', file=f)
    f.write(''.join(output_code))