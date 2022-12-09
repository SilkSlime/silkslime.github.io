from pathlib import Path
from pydantic import BaseModel
from datetime import timedelta
from typing import List
import json

S_DIR = Path('schedules')

class Bus(BaseModel):
    name: str
    time: int
    est: int
    dofs: List[int]

class Route(BaseModel):
    name: str
    buses: List[Bus]

def get_dofs_from_str(s: str) -> List[int]:
    mapping = {
        'ПН': 1,
        'ВТ': 2,
        'СР': 3,
        'ЧТ': 4,
        'ПТ': 5,
        'СБ': 6,
        'ВС': 0
    }
    dofs = []
    if s == 'БУДНИ':
        return [1,2,3,4,5]
    elif s == 'ВЫХОДНЫЕ':
        return [6, 0]
    elif '-' in s:
        dofs = []
        f, t = list(map(lambda x: mapping[x], s.split('-')))
        i = f
        while i != t:
            dofs.append(i)
            i = (i+1) % 7
        dofs.append(i)
        return dofs
    else:
        return [mapping[s[i:i+2]] for i in range(0, len(s), 2)]

routes = []
for routes_dir in S_DIR.iterdir():
    route_buses: List[Bus] = []
    route_name = routes_dir.stem
    for schedule_path in routes_dir.iterdir():
        bus_name, dofs = schedule_path.stem.split('_')
        bus_dofs = get_dofs_from_str(dofs)
        schedule_data = schedule_path.read_text()
        last_hour = 0
        for hour_line in schedule_data.split('\n'):
            hour_line_splitted = hour_line.split()
            hour, minutes = int(hour_line_splitted[0]), list(map(int, hour_line_splitted[1:]))
            for minute in minutes:
                bus_time = timedelta(hours=hour, minutes=minute).seconds
                route_buses.append(Bus(
                    name=bus_name,
                    time=bus_time,
                    est=600,
                    dofs=bus_dofs if hour > last_hour else list(map(lambda x: (x+1)%7, bus_dofs))
                ).dict())
            last_hour = hour
    routes.append(Route(
        name=route_name,
        buses=route_buses
    ).dict())

# print(json.dumps(routes))
with open("routes.js", "w") as f:
    f.write(f"let routes = JSON.parse(`{json.dumps(routes)}`);")