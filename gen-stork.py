#!/usr/bin/env python

from glob import glob
from os.path import basename,splitext
baseurl = "https://blog.binaergewitter.de"
def gen_articles():
    for path in glob('articles/*.markdown'):
        for line in open(path).readlines():
            if line.startswith('title:'):
                title = line.split(':',1)[1].strip().strip('"')
                break
        year,month,day,rest = splitext(basename(path))[0].split("-",3)
        url = f"{baseurl}/{year}/{month}/{day}/{rest}/"

        print(f'{{title = "{title}",url = "{url}", path = "{path}"}},')

def gen_static():
    for path in glob('pages/*.markdown'):
        for line in open(path).readlines():
            if line.startswith('title:'):
                title = line.split(':',1)[1].strip().strip('"')
                break
        rest = splitext(basename(path))[0]
        url = f"{baseurl}/pages/{rest}/"
        print(f'{{title = "{title}",url = "{url}", path = "{path}"}},')

def header():
    print("""[input]
base_directory = "./."
files = [
""")
def footer():
    print("""]
""")

def main():
    header()
    gen_articles()
    gen_static()
    footer()

if __name__ == "__main__":
    main()
