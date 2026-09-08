# docs/brief/build.py. Builds domain.html (2 pages) and vision.html (5 pages) on _sheet.css, then Chrome prints them.
# The oval is the shop's own mark. neonburro is one word, lowercase, always. No red on ink. No dots in copy.
import subprocess, os
OVAL=open('_oval.svg').read()
ICONS={
 'globe':'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
 'send':'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
 'bulb':'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
 'pen':'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
 'coffee':'<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>',
 'box':'<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7L12 12l8.7-5M12 22V12"/>',
 'phone':'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2z"/>',
}
icon=lambda n: f'<div class="icon"><svg viewBox="0 0 24 24">{ICONS[n]}</svg></div>'
FOOT='<div class="foot"><div class="l">Fishbone Graphics, Ridgway CO</div><div class="nb"><div class="t"><b>neonburro</b> &bull; prepared with care &bull; tyler@neonburro.com</div><img src="nb-mark.png" alt=""></div></div>'
def head(ic, title=None, lede=None):
    h=f'<div class="head"><div class="lockup">{OVAL}</div>{icon(ic)}</div>'
    if title: h+=f'<h1>{title}</h1>'
    if lede: h+=f'<p class="lede">{lede}</p>'
    return h+'<div class="rule"></div>'
page=lambda body: f'<section class="page">{body}{FOOT}</section>'
DOTS='<span style="color:#EE7A4B">.</span><span style="color:#7C8C5E">.</span><span style="color:#2F8FB0">.</span>'
def cover(title):
    return f'<section class="page cover"><div class="oval">{OVAL}</div><div class="funny">{title}</div><div class="est">Est 1985, Ridgway, Colorado</div><div class="prep">prepared by <b>neonburro</b></div></section>'
doc=lambda title,pages: f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="_sheet.css"></head><body>{"".join(pages)}</body></html>'
def card(k, body, white=False, ink=False, style=''):
    return f'<div class="card{" w" if white else ""}{" ink" if ink else ""}" style="{style}"><span class="k">{k}</span>{body}</div>'

# ── the domain, two pages ──
d1 = head('globe','Your web address, and a simple move.','Where fishbonegraphics.com lives today, and the one small move that gets it ready for the new site. One web address, one place for the tools, neonburro on call for anything technical. Nothing changes until you say so.') + '<div class="grid g2">' + card('What we found','''<table>
<tr><td>Business</td><td>Fishbone, Inc., Colorado, since May 2000, in good standing</td></tr>
<tr><td>Domain</td><td>fishbonegraphics.com at GoDaddy, registered in 2001, renews August 2027</td></tr>
<tr><td>Nameservers</td><td>GoDaddy. This is the part that points the name at a website</td></tr>
<tr><td>Website</td><td>WordPress with the YooTheme builder, hosted at Scala Hosting</td></tr>
<tr><td>Email</td><td>Microsoft 365. Stays exactly as it is, we work around it</td></tr></table>''',white=True) + card('Why Cloudflare','<p>It is where the web is heading. Fast, secure and built for the next few years of agents, smart marketing and what we call marketing engineering. It is what we build on. Moving the name itself is optional and not urgent. If you ever want to, registration is about $10 a year, roughly half of GoDaddy, and it does not come up until August 2027. Cloudflare helps with that move and so do we.</p>') + '</div>' + '<div class="grid g2" style="margin-top:10pt">' + card('One small thing worth fixing anyway','<p>Your domain still tells the world that GoDaddy sends your email, but Microsoft does. Some mail from the shop is probably landing in spam folders because of it. One line, fixed during the move, free.</p>') + card('What stops costing money after launch','<p>The Scala hosting plan, the YooTheme license and the two plugins. The domain and Microsoft 365 stay. We host the new site and the back room, and that is a conversation, not a surprise.</p>') + '</div>'
d2 = head('send','The move, in three steps.','Fifteen minutes total. We can do all of it with you on the phone, or all of it for you.') + '''<ol class="steps" style="gap:12pt">
<li><div><b>A Cloudflare account, in your name</b><span>Five minutes at cloudflare.com. It is yours, you hold the keys, we get a seat so we can help.</span></div></li>
<li><div><b>Add fishbonegraphics.com to it</b><span>Cloudflare copies your current records on its own. We double check the email ones so Microsoft 365 keeps working, and fix the spam setting while we are in there.</span></div></li>
<li><div><b>Paste two lines at GoDaddy</b><span>Cloudflare gives you two nameserver addresses, they go in the GoDaddy domain settings. That is the whole move. The old site and your email keep running, and the new site goes live when you tell us.</span></div></li>
</ol>''' + '<div class="grid g2" style="margin-top:14pt">' + card('Happy to do it for you','<p>Twenty minutes on the phone, or add tyler@neonburro.com as a delegate on your GoDaddy account and we do it start to finish. The domain stays in your name the whole time.</p>') + card('Then everything is in one place','<p>The site, the back room, the emails, the forms, the inventory, the marketing. Custom built around the shop, not a template, and we keep building whatever the shop needs next.</p>') + '</div>' + '<div style="margin-top:12pt">' + card('Notes','<div class="lines" style="height:150pt;background:repeating-linear-gradient(to bottom, transparent 0, transparent 18pt, var(--line) 18pt, var(--line) 19pt)"></div>',white=True) + '</div>'
open('domain.html','w').write(doc('Your web address, and a simple move',[cover('The web address, and a simple move<span style="color:#EE7A4B">.</span>'),page(d1),page(d2)]))

# ── the vision, five pages ──
v1 = head('bulb',f'The site, the way you print. Evolving{DOTS}','Forty years of shirts and a website that never asked anyone for a job. We built one that does, and a back room where the shop can see it all and keep an eye on it. What is on it today is our first pass. It gets tailored with your ideas, and all ideas are welcome. This page is the idea, the next four are the questions.') + '<div class="grid g2">' + card('Out front','<h3>The site</h3><p>Your photos, your voice, your work ethic, quietly. People can send art, ask for a run, see the wall and find the shop. Runs start at the blank with the real catalog colors. Screens you already have can become a design of the week that sells off the rack. It only looks like you if it is built from your pictures, so that is the first thing we need.</p>',white=True) + card('Backstage','<h3>The back room</h3><p>Every request lands in one place. Start a run, add the garments, send a quote. The customer taps accept on their phone and you are told. Stock on the shelf with initials on every move. Customers with history. Notes between the crew. Every price set by you, in the app, any time.</p>',white=True) + '</div><div class="grid g2" style="margin-top:9pt">' + card('Flexible on purpose','<p>Custom build, not a template, with a back end anyone on the crew can use. Invite whoever you want. Words, prices, photos, colors, what is on the menu, all of it changes from Backstage. It evolves around your vision, and every vision is welcome. If the front of the site should move, we build that too.</p>') + card('Finding the jobs you like','<p>Tell us your ideal orders. Your standards, your minimums, the quantities that make sense, the best money makers. That gives us a niche to market, and we mean market. Backstage gets a corner that tracks what people looked at and asked for, so the shop can see which door they came through and go find more of the same.</p>') + '</div><div style="margin-top:9pt">' + card('Not a pitch','<p>This is a local handoff, one Ridgway business helping another. The site is built and running on a test address you can poke at today. For the full experience we need two things connected. The web address, and the email, so the quotes, receipts and login notes go out as Fishbone instead of us. Then we get connected to, well, stuff. Impressive stuff. Branded emails, live inventory, the marketing corner. The kind of stuff that makes a Tuesday easier. If any of this reads too loud, we turn it down.</p>',ink=True) + '</div>'
QS=[('The jobs you love most','Businesses, ski patrol, towns, festivals, bands, schools, fundraisers. The ones you would take every week. We develop those niches on the site, then track and watch the traffic to them.'),
('How far you want to reach','Ridgway and the valley, all of Colorado or shipping nationwide on the bigger runs. Are you open to online ordering above a minimum, and to shipping at all.'),
('Photos, and the art itself','This is the big one. Everything on the site right now is small thumbnails we could pull off the internet. Full size photos of the work and the shop, as many as you have, and if you separate art into films, a few jobs as their separations. Whatever you share, we size it, tag it and wire it so the internet crawls it right. Behind the scenes stuff we do anyway. Nothing goes live until you approve it.'),
('How a job moves today','Someone calls and needs four hundred sweatshirts by Friday. Then what. What works, what is a pain, what you would never change and what you would be open to if the site brought in new kinds of jobs.'),
('The smallest run, and the clock','Your minimum, normal turnaround and what rush costs. Blanks from stock or ordered in, and the usual order times. If you can, break the process down by days. Backstage can promise a customer a date or a window on every quote.'),
('Prices, and what changes them','Is it quantity and colors, or also the upcharge above 2XL, screens, separations, design time. Rough is fine, every number stays editable.'),
('Getting paid','Bank transfer, or a check to the shop or a PO box. Or are you open to cards. Stripe, Square, any point of sale you already run. Whatever is easiest for you is what we wire in.'),
('Who answers, and who needs a login','Which inboxes you watch, one or several, and who on the crew should have a Backstage login. It is all in development, so access is for trying things and telling us what is wrong.'),
('The tools you touch every day','List the software you use, from art to invoices to the calendar. We would rather connect to what you have than replace it.'),
('The phone','Do calls get missed during a run. Would a voicemail that arrives in your inbox as text help, or a simple menu when someone calls. Only if it would make a day easier.'),
('The calendar, and the rack','Festivals and events you print for each year. Printed stock, seconds or overruns you would sell online as random sizes, no returns.'),
('Scale','The fixed yearly projects, the biggest job you have run and what a full week at capacity looks like. Not who, just how much. It tells us what the site should be ready for.')]
q=lambda i,t,s: f'<div class="q"><i>{i:02d}</i><div class="body"><b>{t}</b><span>{s}</span><div class="lines"></div></div></div>'
qpage=lambda ic,title,lede,rng: head(ic,title,lede)+''.join(q(i+1,*QS[i]) for i in rng)
v2 = qpage('pen','Twelve things, then we build the rest.','Short answers are great. Long ones are better. Write on this, email it back or call and talk it through with us.', range(0,3))
v3 = qpage('coffee',None,None, range(3,6))
v4 = qpage('box',None,None, range(6,9))
v5 = qpage('phone',None,None, range(9,12)) + '<div style="margin-top:10pt">' + card('Then what','<p>Send this back any way you like, a photo of it on the press is fine. We fold the answers into the site, walk you through Backstage in person and move the web address when you say go. Call or write any time, tyler@neonburro.com.</p>',ink=True) + '</div>'
open('vision.html','w').write(doc('The site, the way you print',[cover('Systems upgrade and digital plan<span style="color:#EE7A4B">.</span>'),page(v1),page(v2),page(v3),page(v4),page(v5)]))
CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
for f in ['domain','vision']:
    subprocess.run([CH,'--headless=new','--disable-gpu','--no-pdf-header-footer','--virtual-time-budget=6000',f'--print-to-pdf={os.getcwd()}/fishbone-{f}.pdf',f'file://{os.getcwd()}/{f}.html'],capture_output=True)
print('built')
