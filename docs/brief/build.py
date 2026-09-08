# docs/brief/build.py. Builds domain.html and vision.html on _sheet.css, then Chrome prints them.
import subprocess, os
LOCKUP=open('_lockup.svg').read()
FOOT='<div class="foot"><div class="l">Fishbone Graphics, 250 S Lena St, Ridgway, Colorado</div><div class="nb"><div class="t"><b>Neon Burro</b><br>Prepared by Tyler Reagan<br>tyler@neonburro.com</div><img src="nb-mark.png" alt=""></div></div>'
def head(kicker, title=None, lede=None):
    h=f'<div class="head"><div class="lockup">{LOCKUP}<b>Fishbone<small>Graphics</small></b></div><div class="k" style="text-align:right">{kicker}</div></div>'
    if title: h+=f'<h1>{title}</h1>'
    if lede: h+=f'<p class="lede">{lede}</p>'
    return h+'<div class="rule"></div>'
page=lambda body: f'<section class="page">{body}{FOOT}</section>'
doc=lambda title,pages: f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="_sheet.css"></head><body>{"".join(pages)}</body></html>'
card=lambda k,body,white=False,ink=False: f'<div class="card{" w" if white else ""}"{" style=\"background:var(--ink);color:var(--bone);border-color:var(--ink)\"" if ink else ""}><span class="k"{" style=\"color:var(--red)\"" if ink else ""}>{k}</span>{body}</div>'

d1 = head('September 2026','Your web address, and a simple move.','Everything we could see from outside about where fishbonegraphics.com lives today, and the one small move that gets it ready for the new site. Nothing here changes until you say so.') + '<div class="grid g2">' + card('What we found','''<table>
<tr><td>Business</td><td>Fishbone, Inc., Colorado, since May 2000, in good standing</td></tr>
<tr><td>Domain</td><td>fishbonegraphics.com at GoDaddy, registered in 2001, renews August 2027</td></tr>
<tr><td>Nameservers</td><td>GoDaddy. This is the part that points the name at a website</td></tr>
<tr><td>Website</td><td>WordPress with the YooTheme builder, hosted at Scala Hosting</td></tr>
<tr><td>Email</td><td>Microsoft 365. Stays exactly as it is</td></tr></table>''',white=True) + card('One thing worth fixing anyway','<p>Your domain still tells the world that GoDaddy sends your email, but Microsoft does. Some mail from the shop is probably landing in spam folders because of it. It is a one line fix and it comes free with the move below.</p><span class="k" style="margin-top:10pt">What stops costing money after launch</span><p>The Scala hosting plan, the YooTheme license and the two plugins. The domain and Microsoft 365 stay.</p>') + '</div>' + '''<h2 style="margin-top:14pt">The move, in three steps</h2>
<ol class="steps">
<li><div><b>A free Cloudflare account, in your name</b><span>Five minutes at cloudflare.com. Cloudflare hosts the name for free and it is what we recommend. It is yours, you hold the keys, we get a seat so we can help.</span></div></li>
<li><div><b>Add fishbonegraphics.com to it</b><span>Cloudflare copies your current records on its own. We double check the email ones so Microsoft 365 keeps working, and we fix the spam line while we are in there.</span></div></li>
<li><div><b>Paste two lines at GoDaddy</b><span>Cloudflare gives you two nameserver addresses. They go in the GoDaddy domain settings. That is the whole move. The old site and your email keep running, and the new site goes live when you tell us.</span></div></li>
</ol>''' + '<div style="margin-top:12pt">' + card('Happy to do it for you','<p>If you would rather not click through any of it, we can. Twenty minutes on the phone, or add tyler@neonburro.com as a delegate on your GoDaddy account and we do it start to finish. The domain stays in your name.</p>') + '</div>'
open('domain.html','w').write(doc('Your web address, and a simple move',[page(d1)]))

v1 = head('September 2026','The site, the way you print.','Forty years of shirts and a website that never asked anyone for a job. We built a new one that does, and a back room where the shop can see it all. Everything on it bends to how you actually work. This page is the idea, the next two are the questions.') + '<div class="grid g2">' + card('Out front','<h3>The site</h3><p>Your photos, your voice, one red. People can send art, ask for a run, see the work and find the shop. Runs start at the blank, with the real catalog colors. Prints you already have screens for can sell straight off the rack. Nothing on it is stock.</p>',white=True) + card('Backstage','<h3>The back room</h3><p>Every request lands in one place. Start a run from it, add the garments, send a quote. The customer taps accept on their phone and you are told. Stock on the shelf with initials on every move. Customers with history. Notes to the crew. Everything priced by you, in the app, any time.</p>',white=True) + '</div><div class="grid g2" style="margin-top:10pt">' + card('Flexible on purpose','<p>This is a custom build, not a template, with a back end anyone on the crew can use. Words, prices, photos, colors, what is on the menu, all of it changes from Backstage. If you ever want the front of the site to move, we build that in too. It is made to be tailored to the way your day already runs, not the other way around.</p>') + card('Finding the jobs you like','<p>Tell us the kind of order you enjoy most and we point the site at it. Backstage gets a small marketing corner that shows what people looked at and asked for, so the shop can see which door they came through and go find more of the same.</p>') + '</div><div style="margin-top:10pt">' + card('Not a pitch','<p style="color:var(--bone)">This is a local handoff, one Ridgway business helping another. The site is built and running on a test address. What we need from you fits on the next two pages, and none of it is technical.</p>',ink=True) + '</div>'
QS=[('The job you love printing most','Festival lines, band merch, a school, a brewery, a fundraiser. The one you would take every week if you could. We will aim the site at it.'),
('How far you want to reach','Just Ridgway and the valley, all of Colorado, or shipping nationwide for the bigger runs. This decides a lot about what the site says.'),
('Photos and art','Full size photos of the work and the shop, the logo files, and if you have them, a few favorite jobs as color separations. That is what makes the site look like you and gives us things worth sharing.'),
('How a job moves today','From the first call to the last box. What works, what is a pain, what you would never change.'),
('Your minimum, and turnaround','The smallest run worth doing, normal turnaround, and what rush costs.'),
('Prices, and what changes them','Unit prices by quantity and colors, the upcharge above 2XL, design and separations, screens. Rough is fine, every number is editable later.'),
('Getting paid','Invoice, deposit up front, card at pickup, Stripe or Square. Whatever you do now.'),
('Who answers, and who needs a login','Where requests should land, who reads the inbox, and who on the crew should have a Backstage login.'),
('The calendar and the rack','Festivals and events you print for each year. Printed stock, seconds or overruns you would sell online as random sizes, no returns.')]
q=lambda i,t,s: f'<div class="q"><i>{i:02d}</i><div><b>{t}</b><span>{s}</span><div class="lines"></div></div></div>'
v2 = head('Nine questions','Nine things, then we build the rest.','Short answers are great. Long ones are better. Write on this, email it back, or just call and talk through it with us.') + ''.join(q(i+1,*QS[i]) for i in range(5))
v3 = head('Nine questions, continued') + ''.join(q(i+1,*QS[i]) for i in range(5,9)) + '<div style="margin-top:12pt">' + card('Then what','<p style="color:var(--bone)">Send this back any way you like, a photo of it is fine. We fold the answers into the site, walk you through Backstage in person, and move the web address when you say go. Call or write any time, tyler@neonburro.com.</p>',ink=True) + '</div>'
open('vision.html','w').write(doc('The site, the way you print',[page(v1),page(v2),page(v3)]))
CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
for f in ['domain','vision']:
    subprocess.run([CH,'--headless=new','--disable-gpu','--no-pdf-header-footer','--virtual-time-budget=6000',f'--print-to-pdf={os.getcwd()}/fishbone-{f}.pdf',f'file://{os.getcwd()}/{f}.html'],capture_output=True)
print('built')
