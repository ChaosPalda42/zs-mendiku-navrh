# Generuje "fotky školy" lokálně (FLUX.2 Klein 4B přes mflux, MLX). Žádná reálná data.
import subprocess, sys, os, json, concurrent.futures as cf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIN = os.path.join(os.path.dirname(ROOT), "_nastroje", "mflux-venv", "bin", "mflux-generate-flux2")
OUT = os.path.join(ROOT, "img-src"); os.makedirs(OUT, exist_ok=True)
STYLE = ", candid editorial photograph, natural light, realistic, Czech school in Prague, no text, no watermark, no logos"
SIZES = {"hero": (1280, 1024), "wide": (1280, 800), "sq": (1024, 1024), "four3": (1200, 900), "banner": (1536, 864)}
IMAGES = [
  ("hero-zs", "hero", "Group of primary school children aged 7-12 with backpacks laughing in front of a renovated 1930s functionalist yellow school building with big windows, autumn morning sunlight, trees"),
  ("hero-ms", "hero", "Kindergarten children aged 3-6 playing joyfully in a green school garden with a wooden playground and sandbox, teacher smiling in background, warm afternoon light"),
  ("news-1", "wide", "Primary school pupils at a sports day on a grass field, colourful cones, running race, cheering classmates, sunny day"),
  ("news-2", "wide", "Children aged 10 doing a chemistry experiment with safety goggles in a modern school lab, teacher helping, bright room"),
  ("news-3", "wide", "School Christmas market in a decorated school hall, children selling handmade gifts at stalls, parents browsing, warm lights"),
  ("news-4", "wide", "Class of children on a school trip on a hill viewpoint above a Czech landscape, teacher pointing, blue sky"),
  ("news-5", "wide", "Children reading books in a cosy school library corner with cushions, big window, plants"),
  ("news-6", "wide", "Pupils programming small robots on a table in a modern IT classroom, laptops, 3D printer in background"),
  ("news-7", "wide", "Parents and teacher talking at a parent-teacher meeting in a bright classroom in the evening, friendly atmosphere"),
  ("news-8", "wide", "Kids in a school theatre performance on a small stage with costumes, audience of children clapping"),
  ("gallery-1", "sq", "Children painting with watercolours in an art classroom, colourful papers on the table"),
  ("gallery-2", "sq", "School volleyball match in a gym, kids jumping at the net"),
  ("gallery-3", "sq", "Children ice skating on an outdoor rink in winter, laughing"),
  ("gallery-4", "sq", "Kids planting flowers in raised beds in a school garden, eco club"),
  ("gallery-5", "sq", "Class photo style: children standing on stairs in front of a school, smiling, but faces are diverse and natural"),
  ("gallery-6", "sq", "Children building a tall tower from wooden blocks in an after-school club"),
  ("gallery-7", "sq", "Kids hiking on a forest trail with a teacher, autumn leaves"),
  ("gallery-8", "sq", "A child holding a medal at a school athletics competition, proud"),
  ("gallery-9", "sq", "Children playing chess in a classroom, concentrated"),
  ("gallery-10", "sq", "Lantern parade of children with paper lanterns at dusk in a city park"),
  ("gallery-11", "sq", "Kids in a swimming pool lesson with a coach, indoor pool"),
  ("gallery-12", "sq", "Children in a museum looking at a dinosaur skeleton, school excursion"),
  ("druzina", "four3", "After-school club: children playing outdoors on a playground on a hill above Prague rooftops, afternoon sun"),
  ("about-1", "four3", "Exterior of a renovated 1930s functionalist school building in Prague, yellow facade, large windows, trees, clear sky"),
  ("about-2", "banner", "Bright modern school corridor with lockers, big windows and children's artwork on walls, empty, morning light"),
  ("projekt-1", "wide", "Children presenting a science poster to classmates in a classroom, project day"),
  ("projekt-2", "wide", "Kids dressed as prehistoric people making cave paintings on paper, school project fun"),
  ("projekt-3", "wide", "Pupils sleeping-bag night at school, reading with flashlights in a classroom, playful"),
  ("projekt-4", "wide", "Children with a teacher at a river bank measuring water with test kit, ecology project"),
  ("ms-1", "wide", "Kindergarten classroom with small children aged 3-4 playing with building blocks on a carpet, colourful room"),
  ("ms-2", "wide", "Kindergarten children aged 5 singing in a circle with a teacher playing guitar"),
  ("ms-3", "wide", "Preschool children painting at small easels outdoors in a garden"),
]
def gen(item):
    name, size, prompt = item
    out = os.path.join(OUT, f"{name}.png")
    if os.path.exists(out): return name, "skip"
    w, h = SIZES[size]
    seed = sum(map(ord, name))
    r = subprocess.run([BIN, "--model", "flux2-klein-4b", "--steps", "4", "--seed", str(seed), "--width", str(w), "--height", str(h), "--prompt", prompt + STYLE, "--output", out], capture_output=True, text=True)
    return name, ("ok" if r.returncode == 0 else "ERR " + r.stderr[-300:])
if __name__ == "__main__":
    only = sys.argv[1:]
    todo = [i for i in IMAGES if not only or i[0] in only]
    with cf.ThreadPoolExecutor(max_workers=2) as ex:
        for name, st in ex.map(gen, todo): print(name, st, flush=True)
