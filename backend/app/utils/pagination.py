import math
def page_count(total:int,page_size:int)->int: return math.ceil(total/page_size) if total else 0
