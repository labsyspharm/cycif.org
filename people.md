---
title: People
---


{% assign peopleData=site.data.people %}
<ul class="list-unstyled row">
        {% for person in peopleData %}
            <li class="media mb-5 col-md-6">
                <img class="mr-3 w-25 rounded" src="{{ person.image }}" style="max-width: 100px" alt="Generic placeholder image">
                <div class="media-body">
                <h5 class="mt-0 mb-1">{{ person.name }}</h5>
                <!-- {{ person.role }} -->
                <p class="mt-2">
                    {% for affiliation in person.affiliations %}
                    {{ affiliation }}{% unless forloop.last %}; {% endunless %}
                    {% endfor %} 
                </p>
                <p class="mt-2">
                        email: <span class="mx-1">{{ person.email }}{% unless forloop.last %} {% endunless %}</span><br/>
                        {% if person.links %}links:{% endif %}
                        {% for linkHash in person.links %}
                            {% for link in linkHash %}
                            <a href="{{ link[1] }}" class="mx-1">{{ link[0] | capitalize }}</a> 
                            {% endfor %}
                        {% endfor %}
                    </p>
                </div>
            </li>
        {% endfor %}
</ul>
