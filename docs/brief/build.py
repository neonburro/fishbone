# docs/brief/build.py. Builds domain.html and vision.html on _sheet.css, then Chrome prints them to PDF.
# The oval is the shop's own mark, traced from their site. neonburro is one word, lowercase, always.
import subprocess, os
OVAL=open('_oval.svg').read()
FOOT='<div class="foot"><div class="l">Fishbone Graphics, Ridgway CO</div><div class="nb"><div class="t"><b>neonburro</b> &bull; prepared by tyler reagan &bull; tyler@neonburro.com</div><img src="nb-mark.png" alt=""></div></div>'
def head(kicker, title=None, lede=None):
    h=f'<div class="head"><div class="lockup">{OVAL}</div><div class="k" style="text-align:right">{kicker}</div></div>'
    if title: h+=f'<h1>{title}</h1>'
    if lede: h+=f'<p class="lede">{lede}</p>'
    return h+'<div class="rule"></div>'
page=lambda body: f'<section class="page">{body}{FOOT}</section>'
doc=lambda title,pages: f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="_sheet.css"></head><body>{"".join(pages)}</body></html>'
def card(k, body, white=False, ink=False, style=''):
    cls='card'+(' w' if white else '')+(' ink' if ink else '')
    return f'<div class="{cls}" style="{style}"><span class="k">{k}</span>{body}</div>'

# ── the domain ──
d1 = head('September 2026','Your web address, and a simple move.','Where fishbonegraphics.com lives today, and the one small move that gets it ready for the new site. One web address, one place for the tools, neonburro on call for anything technical. Nothing changes until you say so.') + '<div class="grid g2">' + card('What we found','''<table>
<tr><td>Business</td><td>Fishbone, Inc., Colorado, since May 2000, in good standing</td></tr>
<tr><td>Domain</td><td>fishbonegraphics.com at GoDaddy, registered in 2001, renews August 2027</td></tr>
<tr><td>Nameservers</td><td>GoDaddy. This is the part that points the name at a website</td></tr>
<tr><td>Website</td><td>WordPress with the YooTheme builder, hosted at Scala Hosting</td></tr>
<tr><td>Email</td><td>Microsoft 365. Stays exactly as it is, we work around it</td></tr></table>''',white=True) + card('Why Cloudflare','<p>It is where the web is heading: fast, secure, and built for the next few years of agents, smart marketing and what we call marketing engineering. It is what we build on. Moving the name itself is optional and not urgent. If you ever want to, registration is about $10 a year, roughly half of GoDaddy, and it does not come up until August 2027. Cloudflare helps with that move and so do we.</p>') + '</div>' + '''<h2 style="margin-top:12pt">The move, in three steps</h2>
<ol class="steps">
<li><div><b>A Cloudflare account, in your name</b><span>Five minutes at cloudflare.com. It is yours, you hold the keys, we get a seat so we can help.</span></div></li>
<li><div><b>Add fishbonegraphics.com to it</b><span>Cloudflare copies your current records on its own. We double check the email ones so Microsoft 365 keeps working, and fix a small spam setting while we are in there. Your domain still says GoDaddy sends your mail, and Microsoft does.</span></div></li>
<li><div><b>Paste two lines at GoDaddy</b><span>Cloudflare gives you two nameserver addresses, they go in the GoDaddy domain settings. That is the whole move. The old site and your email keep running, and the new site goes live when you tell us.</span></div></li>
</ol>''' + '<div class="grid g2" style="margin-top:10pt">' + card('Happy to do it for you','<p>Twenty minutes on the phone, or add tyler@neonburro.com as a delegate on your GoDaddy account and we do it start to finish. The domain stays in your name.</p>') + card('Then everything is in one place','<p>The site, the back room, the emails, the forms, the inventory, the marketing. Custom built around the shop, not a template, and we keep building whatever the shop needs next.</p>') + '</div>'
open('domain.html','w').write(doc('Your web address, and a simple move',[page(d1)]))

# ── the vision ──
v1 = head('September 2026','The site, the way you print.','Forty years of shirts and a website that never asked anyone for a job. We built one that does, and a back room where the shop can see it all and keep an eye on it. What is on it today is our first pass. It gets tailored with your ideas, and all ideas are welcome. This page is the idea, the next two are the questions.') + '<div class="grid g2">' + card('Out front','<h3>The site</h3><p>Your photos, your voice, your work ethic, quietly. People can send art, ask for a run, see the wall and find the shop. Runs start at the blank with the real catalog colors. Screens you already have can become a design of the week that sells off the rack. It only looks like you if it is built from your pictures, so that is the first thing we need.</p>',white=True) + card('Backstage','<h3>The back room</h3><p>Every request lands in one place. Start a run, add the garments, send a quote. The customer taps accept on their phone and you are told. Stock on the shelf with initials on every move. Customers with history. Notes between the crew. Every price set by you, in the app, any time.</p>',white=True) + '</div><div class="grid g2" style="margin-top:9pt">' + card('Flexible on purpose','<p>Custom build, not a template, with a back end anyone on the crew can use. Invite whoever you want. Words, prices, photos, colors, what is on the menu, all of it changes from Backstage. It evolves around your vision, and every vision is welcome. If the front of the site should move, we build that too.</p>') + card('Finding the jobs you like','<p>Tell us your ideal orders. Your standards, your minimums, the quantities that make sense, the best money makers. That gives us a niche to market, and we do mean market: Backstage gets a corner that tracks what people looked at and asked for, so the shop can see which door they came through and go find more of the same.</p>') + '</div><div style="margin-top:9pt">' + card('Not a pitch','<p>This is a local handoff, one Ridgway business helping another. The site is built and running on a test address you can poke at today. For the full experience we need two things connected: the web address, and email, so the quotes, receipts and login notes go out as Fishbone instead of us. Then we get connected to, well, stuff. Impressive stuff. Branded emails, live inventory, the marketing corner. The kind of stuff that makes a Tuesday easier.</p>',ink=True) + '</div>'
QS=[('The jobs you love most','Businesses, ski patrol, towns, festivals, bands, schools, fundraisers. The ones you would take every week. We develop those niches on the site, then track and watch the traffic to them.'),
('How far you want to reach','Ridgway and the valley, all of Colorado, or shipping nationwide on the bigger runs. Are you open to online ordering above a minimum? Free shipping on certain items works when the cost lives quietly in the setup.'),
('Photos, and the art itself','This is the big one. Full size photos of the work and the shop, as many as you have. If you separate art into films, we would love a few jobs as their separations. Layers on a website make for a very good show. Share anything with us and we get creative. Nothing goes live until you approve it.'),
('How a job moves today','Someone calls and needs four hundred sweatshirts by Friday. Then what. What works, what is a pain, what you would never change, and what you would be open to if the site brought in new kinds of jobs.'),
('The smallest run, and the clock','Your minimum, normal turnaround, and what rush costs. Blanks from stock or ordered in, and the usual order times. If you can, break the process down by days. Backstage can promise a customer a date, or a window, on every quote.'),
('Prices, and what changes them','Is it quantity and colors, or also the upcharge above 2XL, screens, separations, design time. Rough is fine, every number stays editable.'),
('Getting paid','Bank transfer, a check to the shop or a PO box, or are you open to cards. Stripe, Square, any point of sale you already run. Whatever is easiest for you is what we wire in.'),
('Who answers, and who needs a login','Which inboxes you watch, one or several, and who on the crew should have a Backstage login. It is all in development, so access is for trying things and telling us what is wrong.'),
('The tools you touch every day','List the software you use, from art to invoices to the calendar. We would rather connect to what you have than replace it.'),
('The calendar, and the rack','Festivals and events you print for each year. Printed stock, seconds or overruns you would sell online as random sizes, no returns.'),
('Scale','The fixed yearly projects, the biggest job you have run, and what a full week at capacity looks like. Not who, just how much. It tells us what the site should be ready for.')]
q=lambda i,t,s: f'<div class="q"><i>{i:02d}</i><div><b>{t}</b><span>{s}</span><div class="lines"></div></div></div>'
v2 = head('Eleven questions','Eleven things, then we build the rest.','Short answers are great. Long ones are better. Write on this, email it back, or call and talk it through with us.') + ''.join(q(i+1,*QS[i]) for i in range(5))
v3 = head('Eleven questions, continued') + ''.join(q(i+1,*QS[i]) for i in range(5,11)) + '<div style="margin-top:10pt">' + card('Then what','<p>Send this back any way you like, a photo of it on the press is fine. We fold the answers into the site, walk you through Backstage in person, and move the web address when you say go. Call or write any time, tyler@neonburro.com.</p>',ink=True) + '</div>'
open('vision.html','w').write(doc('The site, the way you print',[page(v1),page(v2),page(v3)]))
CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
for f in ['domain','vision']:
    subprocess.run([CH,'--headless=new','--disable-gpu','--no-pdf-header-footer','--virtual-time-budget=6000',f'--print-to-pdf={os.getcwd()}/fishbone-{f}.pdf',f'file://{os.getcwd()}/{f}.html'],capture_output=True)
print('built')
