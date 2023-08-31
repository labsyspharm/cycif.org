---
title: People
redirect_to:
  - http://tissue-atlas.org/people
---


{% assign peopleData=site.data.people %}
<ul class="list-unstyled row">
    {% for person in peopleData %}
        {% if person.role != 'alumni' %}
            <li class="media mb-5 col-md-6">
                <img class="mr-3 w-25 rounded" src="
                    {% if person.image contains 'http' %}
                        {{ person.image }}
                    {% else %}
                        {{ site.baseurl }}{{ "/assets/img/people/" | append: person.image }}
                    {% endif %}
                " style="max-width: 100px" alt="Generic placeholder image">
                <div class="media-body">
                <h5 class="mt-0 mb-1">{{ person.name }}</h5>
                <!-- {{ person.role }} -->
                <p class="mt-2">
                    {% for affiliation in person.affiliations %}
                        <span class="d-block">{{ affiliation }} </span>
                    {% endfor %} 
                </p>
                <p class="mt-2">
                        email: <span class="mx-1">{{ person.email }}{% unless forloop.last %} {% endunless %}</span><br/>
                        {% if person.links %}links:{% endif %}
                        {% for linkHash in person.links %}
                            {% for link in linkHash %}
                            <a href="{{ link[1] }}" class="mx-1"
                                {% if link[1] contains 'http' %} target="_blank" {% endif %}>
                                {{ link[0] | capitalize }}
                            </a> 
                            {% endfor %}
                        {% endfor %}
                    </p>
                </div>
            </li>
        {% endif %}
    {% endfor %}
</ul>
<h2>Alumni</h2>
<ul class="list-unstyled row">
    {% for person in peopleData %}
        {% if person.role == 'alumni' %}
            <li class="media mb-5 col-md-6">
                <img class="mr-3 w-25 rounded" src="
                    {% if person.image contains 'http' %}
                        {{ person.image }}
                    {% else %}
                        {{ site.baseurl }}{{ "/assets/img/people/" | append: person.image }}
                    {% endif %}
                " style="max-width: 100px" alt="Generic placeholder image">
                <div class="media-body">
                <h5 class="mt-0 mb-1">{{ person.name }}</h5>
                <!-- {{ person.role }} -->
                <p class="mt-2">
                    {% for affiliation in person.affiliations %}
                        <span class="d-block">{{ affiliation }} </span>
                    {% endfor %} 
                </p>
                <p class="mt-2">
                        email: <span class="mx-1">{{ person.email }}{% unless forloop.last %} {% endunless %}</span><br/>
                        {% if person.links %}links:{% endif %}
                        {% for linkHash in person.links %}
                            {% for link in linkHash %}
                            <a href="{{ link[1] }}" class="mx-1"
                                {% if link[1] contains 'http' %} target="_blank" {% endif %}>
                                {{ link[0] | capitalize }}
                            </a> 
                            {% endfor %}
                        {% endfor %}
                    </p>
                </div>
            </li>
        {% endif %}
    {% endfor %}
</ul>

