from PIL import Image, ImageDraw
S=1024
def draw(maskable=False):
    im=Image.new("RGBA",(S,S),(0,0,0,0))
    bg=Image.new("RGBA",(S,S),(30,58,138,255))
    d=ImageDraw.Draw(bg)
    for i in range(S):  # soft vertical gradient
        c=(int(30+20*i/S),int(58+40*i/S),int(138+60*i/S),255); d.line([(0,i),(S,i)],fill=c)
    sc=0.78 if maskable else 1.0
    cx,cy=S/2,S/2+70*sc
    def P(x,y): return (cx+x*sc, cy+y*sc)
    # open book: two pages
    d.polygon([P(-360,-90),P(-20,-40),P(-20,260),P(-360,210)],fill=(255,255,255,255))
    d.polygon([P(360,-90),P(20,-40),P(20,260),P(360,210)],fill=(241,245,249,255))
    d.polygon([P(-380,210),P(-20,262),P(20,262),P(380,210),P(380,240),P(20,292),P(-20,292),P(-380,240)],fill=(250,204,21,255))
    for k in range(4):
        y=10+k*50
        d.line([P(-310,-40+y-10),P(-70,y+10-10)],fill=(148,163,184,255),width=int(14*sc))
        d.line([P(310,-40+y-10),P(70,y+10-10)],fill=(148,163,184,255),width=int(14*sc))
    # graduation cap
    d.polygon([P(0,-420),P(330,-300),P(0,-180),P(-330,-300)],fill=(17,24,39,255))
    d.polygon([P(-190,-250),P(190,-250),P(190,-150),P(0,-95),P(-190,-150)],fill=(31,41,55,255))
    d.polygon([P(0,-420),P(330,-300),P(0,-180),P(-330,-300)],fill=(17,24,39,255))
    d.ellipse([*P(-22,-322),*P(22,-278)],fill=(250,204,21,255))
    d.line([P(0,-300),P(250,-270),P(250,-150)],fill=(250,204,21,255),width=int(16*sc))
    d.polygon([P(225,-160),P(275,-160),P(285,-90),P(215,-90)],fill=(250,204,21,255))
    mask=Image.new("L",(S,S),0)
    r=0 if maskable else int(S*0.22)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,S-1,S-1),radius=r,fill=255)
    im.paste(bg,(0,0),mask)
    return im
a=draw(); m=draw(True)
a.resize((512,512),Image.LANCZOS).save("icons/icon-512.png")
a.resize((192,192),Image.LANCZOS).save("icons/icon-192.png")
m.resize((512,512),Image.LANCZOS).save("icons/maskable-512.png")
m.resize((180,180),Image.LANCZOS).convert("RGB").save("icons/apple-touch-icon.png")
a.resize((64,64),Image.LANCZOS).save("icons/favicon.png")
a.resize((256,256),Image.LANCZOS).save("icon.ico",sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
print("ok")
