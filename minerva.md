---
title: Minerva
---

## Minerva Story and Minerva Author
Minerva is a suite of software tools for tissue atlases and digital pathology that enables interactive viewing and fast sharing of large image data. It comprises of **Minerva Story**, a narrative, web-based image viewer, and **Minerva Author**, a tool that lets you easily create Minerva stories. Check out the <a href="https://github.com/labsyspharm/minerva-story/wiki" target="_blank"> Minerva Wiki</a> to learn more.

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:800px" class="d-inline-block">
        <img src="{{ "/assets/img/minerva/fig1.jpg" | absolute_url }}"
            alt="Figure 1"
            class="figure-img img-fluid">
    </div>
</figure>


## Featured Stories

{% assign pubData=site.data.rashid-2020 %}

<div class="row">
{% for img in pubData['stitched mosaic images'] %}
<div class="media col-md-4 my-4">
    <img class="mt-1 mr-3 w-50" src="{{ site.baseurl }}{{ "/assets/img/" | append: img['thumbnail file name'] }}" alt="{{ img['thumbnail file name'] }}">
    <div class="media-body">
        <h5 class="mt-0 mb-2">{{ img.title }}</h5>
    <!--    <p>
            {{ img.description }}
    </p> -->
        {% for link_hash in img.links %}
            {% for link in link_hash %}
            <a class="btn btn-outline-primary m-1" href="{{ link[1] }}" {% if link[1] contains 'http' %} target="_blank" {% endif %}>{{ link[0] }}</a>
            {% endfor %}
        {% endfor %}
    </div>
</div>
{% endfor %}
</div>


## How does Minerva work?

Minerva follows a client-server model for delivering content. Images in OME-TIFF format are imported into Minerva Author where a user sets image settings and annotations. Minerva author then renders image pyramids and a configuration file that is read by Minerva Story to deliver the content to clients.

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:800px" class="d-inline-block">
        <img src="{{ "/assets/img/minerva/fig2.jpg" | absolute_url }}"
            alt="Figure 1"
            class="figure-img img-fluid">
    </div>
</figure>



## Minerva Wiki

Check out the <a href="https://github.com/labsyspharm/minerva-story/wiki" target="_blank"> Minerva Wiki</a> for detailed user instructions.

<a href="https://github.com/labsyspharm/minerva-story/wiki" target="_blank"> https://github.com/labsyspharm/minerva-story/wiki</a>

## Code

All source code for Minerva is available on <a href="https://github.com/labsyspharm/minerva-story" target="_blank"> Github</a>.

<a href="https://github.com/labsyspharm/minerva-story" target="_blank"> https://github.com/labsyspharm/minerva-story</a>


## Publications

Rashid R, Chen YA, Hoffer J, Muhlich JL, Lin JR, Krueger R, Pfister H, Mitchell R, Santagata S, and Sorger PK. Interpretative guides for interacting with tissue atlas and digital pathology data using the Minerva browser. *BioRxiv*. (2020) <a href="https://doi.org/10.1101/2020.03.27.001834" target="_blank"> https://doi.org/10.1101/2020.03.27.001834</a>.


## Development Chart

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:800px" class="d-inline-block">
        <img src="{{ "/assets/img/minerva/devchart.jpg" | absolute_url }}"
            alt="Figure 1"
            class="figure-img img-fluid">
    </div>
</figure>