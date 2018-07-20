--- 
title: Featured publication for t-CyCIF 
---

{% assign pubData=site.data.lin-elife-2018 %}

<h2 class="h2">
    {{ pubData.publication.title }}
</h2>
<p class="lead">
    {{ pubData.publication.authors }}
    <br> {{ pubData.publication.journal }}
</p>
<a href="{{ pubData.publication.link.url }}" class="lead">{{ pubData.publication.link.name }}</a>


<h3>Available images</h3>

<div class="row">
{% for img in pubData['stitched mosaic images'] %}
<div class="media col-md-6 my-4">
    <img class="mt-1 mr-3 w-25" src="{{ site.baseurl }}{{ "/assets/img/lin-elife-2018/" | append: img['thumbnail file name'] }}" alt="{{ img['thumbnail file name'] }}">
    <div class="media-body">
        <h5 class="mt-0 mb-2">{{ img.title }}</h5>
        <p>
            {{ img.description }}
        </p>
        {% for link_hash in img.links %}
            {% for link in link_hash %}
            <a class="btn btn-outline-primary m-1" href="{{ link[1] }}">{{ link[0] }}</a>
            {% endfor %}
        {% endfor %}
    </div>
</div>
{% endfor %}
</div>


<!-- <h3>Tools and source code</h3> -->
