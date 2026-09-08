# Blank photos

Where the garment photos on the Runs page come from, and how to add more.

Updated 2026-09-08.

## What is live

Three blanks are active, everything else is off until the shop turns it on
in Backstage under Blanks:

    Comfort Colors 1717   tees      8 colors
    Gildan 5000           tees      7 colors
    Independent SS4500    hoodies   6 colors

Each color has a front photo in public/blanks/<style>-<color>.webp, 900px
wide, converted from the supplier's 1000 by 1250 jpg. product_variants
.image_url and products.images point at those paths, and the tees and
hoodies categories use one each as their card. A leading slash in an
image url means the site's own public folder, anything else is the
storage bucket (see resolveImg in src/pages/Product/index.jsx).

## Where they come from

The catalog the shop buys from, sportswearcollection.com, serves its
photos from S&S Activewear's CDN. Every color has an id on the product
page, and the front flat photo is

    https://cdn.ssactivewear.com/Images/Color/<id>_f_fl.jpg

Note the ids are not the same as the ColorSwatch ids in our blank_colors
table, those are fabric close ups. Read the ids off the product page in a
browser (the color links call iColor('<id>', ...)), then curl the jpg,
resize to 900 wide, save as webp, and set image_url on the variant.

The shop can also upload its own photos from Backstage, which land in the
storage bucket and win over these.
