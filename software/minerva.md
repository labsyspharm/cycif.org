---
title: Minerva
redirect_from: 
  - /data/rashid-perspective-mi-2019/
---
## What is Minerva?

Minerva is a suite of software tools for interpreting and interacting with complex images, organized around a guided analysis approach. The software enables fast sharing of large image data that is stored on Amazon S3 and viewed using a zoomable image viewer implemented using [OpenSeadragon](https://openseadragon.github.io/){:target="_blank"}, making it ideal for integration into multi-omic browsers for data dissemination of tissue atlases. Check out the [Minerva Wiki](https://github.com/labsyspharm/minerva-story/wiki){:target="_blank"} to learn more about the software and for news.

The Minerva suite includes [Minerva Story](https://github.com/labsyspharm/minerva-story/wiki){:target="_blank"}, a narrative, web-based image viewer, and [Minerva Author](https://github.com/labsyspharm/minerva-author/){:target="_blank"}, a tool that enables the user to easily create a guided analysis, or story. Individuals with minimal coding experience can use Minerva Author to create a guided analysis of an image, which is then shared and visualized using Minerva Story.  Guided analyses of multiplexed cyclic multiplex immunofluorescence (CyCIF), immunohistochemistry (IHC), and H&E images created by multiple lab members can be found on the [data page]({{ site.baseurl }}/data/) and in the Featured Stories section below.

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


## How do I implement Minerva?

Check out the [Minerva Wiki](https://github.com/labsyspharm/minerva-story/wiki){:target="_blank"}  for detailed user instructions, which walk the user through downloading and running Minerva Author, importing data, and creating channel groups to author a story. After authoring your story, you will deploy Minerva Story by cloning the repository on GitHub, adding your content to the repository, and deploying your story locally or via GitHub. We have chosen to deploy via GitHub and store data on Amazon S3 for universal sharing. All source code for Minerva is available on Minerva Github.

- Minerva Wiki <a href="https://github.com/labsyspharm/minerva-story/wiki" target="_blank"> https://github.com/labsyspharm/minerva-story/wiki</a>
- Minerva Source Code <a href="https://github.com/labsyspharm/minerva-story" target="_blank"> https://github.com/labsyspharm/minerva-story</a>


## Publications

Rashid R, Chen YA, Hoffer J, Muhlich JL, Lin JR, Krueger R, Pfister H, Mitchell R, Santagata S, and Sorger PK. Interpretative guides for interacting with tissue atlas and digital pathology data using the Minerva browser. *BioRxiv*. (2020) <a href="https://doi.org/10.1101/2020.03.27.001834" target="_blank"> https://doi.org/10.1101/2020.03.27.001834</a>.


## Development Chart

<div class="table-responsive " markdown="1">



{% capture heavy_check_mark %}![alt text]({{ site.baseurl }}/assets/img/minerva/gemoji-heavy_check_mark.png "Logo Title Text 1"){: .h-25}{% endcapture %}

|                      |        Concept         |      Req. Review       |       Development       |     Documentation      | Stage | Rollout | Publication |
|:---------------------|:----------------------:|:----------------------:|:----------------------:|:----------------------:|:-----:|:-------:|:-----------:|
| **Minerva Story**    | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mar|                      |        Concept         |      Req. Review       |       Development       |     Documentation      | Release | Version | Publication |
|:---------------------|:----------------------:|:----------------------:|:----------------------:|:----------------------:|:-----:|:-------:|:-----------:|
| **Minerva Story**    | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }}   | v1.0.0  |      .      |
| **Minerva Author**   | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }}   | v1.1.0  |      .      |
| **Minerva Cloud**    | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} |                        |       |         |             |
| **Minerva Analysis** | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} |                        |       |         |             |
| **Minerva Atlas**    | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} |                        |       |         |             |k }} | {{ heavy_check_mark }} | beta  | v1.0.0  |      .      |
| **Minerva Author**   | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} | beta  | v1.0.0  |      .      |
| **Minerva Cloud**    | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} |                        |       |         |             |
| **Minerva Analysis** | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} |                        |       |         |             |
| **Minerva Atlas**    | {{ heavy_check_mark }} | {{ heavy_check_mark }} | {{ heavy_check_mark }} |                        |       |         |             |
{:class="table table-dark"}

</div>
