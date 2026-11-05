# Legge un FIT e (opzionale) corregge i messaggi "set" (globale 225) sul posto, poi ricalcola il CRC.
# uso: python fit-sets.py in.fit [out.fit patch.json]   patch = lista per serie attiva: {"reps": n, "kg": totale, "rest": true}
import sys, struct, json
CRC = [0x0000,0xCC01,0xD801,0x1400,0xF001,0x3C00,0x2800,0xE401,0xA001,0x6C00,0x7800,0xB401,0x5000,0x9C01,0x8801,0x4400]
def crc(data, c=0):
    for b in data:
        t = CRC[c & 0xF]; c = (c >> 4) & 0x0FFF; c = c ^ t ^ CRC[b & 0xF]
        t = CRC[c & 0xF]; c = (c >> 4) & 0x0FFF; c = c ^ t ^ CRC[(b >> 4) & 0xF]
    return c
buf = bytearray(open(sys.argv[1], 'rb').read())
hs = buf[0]; size = struct.unpack_from('<I', buf, 4)[0]; end = hs + size
assert buf[8:12] == b'.FIT' and crc(buf[:end]) == struct.unpack_from('<H', buf, end)[0], 'FIT non valido'
defs, sets, p = {}, [], hs
while p < end:
    h = buf[p]; p += 1
    if h & 0x80: local, is_def, dev = (h >> 5) & 3, False, False
    else: local, is_def, dev = h & 0xF, bool(h & 0x40), bool(h & 0x20)
    if is_def:
        arch = buf[p + 1]; gnum = struct.unpack_from('>H' if arch else '<H', buf, p + 2)[0]; n = buf[p + 4]; p += 5
        fields = [(buf[p + 3 * i], buf[p + 3 * i + 1]) for i in range(n)]; p += 3 * n
        dsz = 0
        if dev: nd = buf[p]; p += 1; dsz = sum(buf[p + 3 * i + 1] for i in range(nd)); p += 3 * nd
        defs[local] = (gnum, arch, fields, dsz)
    else:
        gnum, arch, fields, dsz = defs[local]; off = {}; q = p
        for num, sz in fields: off[num] = (q, sz); q += sz
        if gnum == 225: sets.append(off)
        p = q + dsz
E = '>' if False else '<'
def get(o, f, fmt):
    if f not in o: return None
    q, sz = o[f]; return struct.unpack_from('<' + fmt, buf, q)[0]
active = [o for o in sets if get(o, 5, 'B') == 1]
for i, o in enumerate(sets):
    print(i, 'attiva' if get(o, 5, 'B') == 1 else 'riposo', 'reps', get(o, 3, 'H'), 'peso', get(o, 4, 'H'), 'durata', get(o, 0, 'I'), 'cat', get(o, 7, 'H'))
print(len(sets), 'serie,', len(active), 'attive; architettura LE:', all(d[1] == 0 for d in defs.values()))
if len(sys.argv) > 3:
    patch = json.load(open(sys.argv[3]))
    assert len(patch) == len(active), f'{len(patch)} correzioni per {len(active)} serie attive'
    for o, pt in zip(active, patch):
        if pt.get('rest'): struct.pack_into('<B', buf, o[5][0], 0)
        if 'reps' in pt: struct.pack_into('<H', buf, o[3][0], pt['reps'])
        if 'kg' in pt: struct.pack_into('<H', buf, o[4][0], round(pt['kg'] * 16))  # peso in scala 1/16 kg
    struct.pack_into('<H', buf, end, crc(buf[:end]))
    open(sys.argv[2], 'wb').write(buf); print('scritto', sys.argv[2])
