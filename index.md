---
redirect_from: /pca2018/
active: home
---

<p class="sidebar-cta">
    <a href="http://pca2018.s3-website-us-east-1.amazonaws.com/">
        View the dynamic melanoma patient sample browser!

        <img class="cta-button"
             src="{{ "/assets/img/cta_button.png" | absolute_url }}"
             alt="Browse">
    </a>
</p>

## t-CyCIF
### Tissue-based cyclic immunofluorescence

* Works with a wide range of FFPE human and mouse tumors and tissues.
* Up to 60-plex imaging of some tissues &mdash; compatible with H&E in final
  round.
* Uses conventional wide-field, confocal and super-resolution microscopes.
* Antibodies can be selected based on the requirements of the project: no
  proprietary or unusual reagents required.

The key publication for t-CyCIF is Lin et al. (2018), *Highly multiplexed
immunofluorescence imaging of human tissues and tumors using t-CyCIF and
conventional optical microscopes*.

* [Read the manuscript](https://doi.org/10.1101/151738)
* [Access supporting data and software code](http://lincs.hms.harvard.edu/lin-elife-2018/)
* [Learn more and get training](training)
* Please cite this resource as `(CycIF.org, RRID:SCR_016267)`

t-CyCIF is a method for highly multiplexed immunofluorescence imaging
of [formalin-fixed, paraffin-embedded](https://en.wikipedia.org/wiki/Histology)
(FFPE) specimens mounted on glass slides, the most widely used specimens for
histopathological diagnosis of cancer and other diseases. A related CyCIF method
is used to image cells grown in culture (see publications). t-CyCIF generates up
to 60-plex images using an iterative process (a cycle) in which conventional
low-plex fluorescence images are repeatedly collected from the same sample and
then assembled into a high dimensional representation.

<div class="embed-container">
    <iframe src="https://player.vimeo.com/video/269885646"
     frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

<div class="embed-container">
    <iframe src="https://player.vimeo.com/video/270692465"
     frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>



t-CyCIF requires no specialized instruments or reagents and is compatible with
super-resolution imaging. We have shown that t-CyCIF can be used to quantify
signal transduction cascades, measure the levels of tumor antigens and determine
immunophenotypes using immune cell lineage markers. The key features of t-CyCIF
are that it is simple to implement on existing microscopes, it requires no
special or proprietary reagents and antibodies can be combined as needed to
investigate specific questions.

### The t-CyCIF Process

In t-CyCIF, ~5 µm thick are cut from FFPE blocks, the standard in most
histopathology services, followed by dewaxing and antigen retrieval in the usual
manner; to reduce auto-fluorescence a cycle of “pre-staining” is performed.
Subsequent t-CyCIF cycles each involve four steps (Figure 1): (i)
immuno-staining with antibodies against protein antigens (three antigens per
cycle in the implementation described here) (ii) staining with a DNA dye
(commonly Hoechst 33342) to mark nuclei and facilitate image registration across
cycles (iii) four-channel imaging at low and high magnifications (iv)
fluorophore bleaching followed by a wash step and then another round of
immuno-staining. The signal-to-noise ratio often increases with cycle number.
When no more t-CyCIF cycles are to be performed, the specimen is stained with
H&E to enable conventional histopathology review. Individual image panels are
stitched together and registered across cycles followed by image processing and
segmentation to identify cells and other structures.

<figure class="image">
    <img src="{{ "/assets/img/figure1.jpg" | absolute_url }}"
         alt="Figure 1"
         width="700">
    <figcaption>
        Figure 1: Assembling a high-plex t-CyCIF image using an
        iterative process
    </figcaption>
</figure>

<div class="embed-container">
    <iframe src="https://player.vimeo.com/video/269904895"
     frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

### Imaging

Imaging of t-CyCIF specimens can be performed on a variety of fluorescent
microscopes each of which represent a different tradeoff between data
acquisition time, image resolution and sensitivity (Figure 2). Specimens several
square centimeters in area are often examined at a resolution of ~1 µm on slide
scanners, but high resolution image is obtained using confocal or structured
illumination microscopes.

<figure class="image">
    <img src="{{ "/assets/img/figure2.jpg" | absolute_url }}"
         alt="Figure 2"
         width="500">
    <figcaption>
        Figure 2: t-CyCIF of a metastatic melanoma at different resolutions
    </figcaption>
</figure>

### Antibodies for tissue-based CyCIF

In the first cycle of t-CyCIF is possible to use indirect immunofluorescence and
secondary antibodies. In all other cycles antibodies are directly conjugated to
fluorophores, typically Alexa 488, 555 or 647. As an alternative to chemical
coupling we have tested the Zenon™ antibody labelling method from ThermoFisher
in which isotype-specific Fab fragments pre-labelled with fluorophores are bound
to primary antibodies to create immune complexes; the immune complexes are then
incubated with tissue samples. This method is effective with some but not all
primary antibodies.

To date, we have tested commercial antibodies against ~200 proteins for their
compatibility with t-CyCIF. These antibodies include lineage makers,
cytoskeletal proteins, cell cycle regulators, the phosphorylated forms of
signaling proteins and kinases, transcription factors, markers of cell state
including quiescence, senescence, apoptosis, stress, etc.
(see [Table 1]({{ "/assets/data/CyCIF-Tested-Antibodies-May2018.xlsx" | absolute_url }})). Currently we rely
exclusively on commercial antibodies that have previously been validated using
immuno-histochemistry (IHC) or conventional immunofluorescence. We compare
staining by t-CyCIF and what has previously been reported for IHC staining
(Figure 3) We also compare directly antibodies against the same antigen by using
different antibodies in different channels; this enables pixel-level comparison
of the same cells (Figure 4).

<figure class="image">
    <img src="{{ "/assets/img/figure3.jpg" | absolute_url }}"
         alt="Figure 3"
         width="800">
    <figcaption>
        Figure 3: Anti-PD1 staining in two successive sections of human tonsil
        by t-CyCIF on the left and IHC in the middle; DNA stained in blue. Right
        panel shows fraction of positive cells for several antibodies by the
        t-CyCIF and IHC.
    </figcaption>
</figure>

<figure class="image">
  <img src="{{ "/assets/img/figure4.jpg" | absolute_url }}"
       alt="Figure 4"
       width="290">
  <figcaption>
    Figure 4: Correlation of anti-PD1 staining by four different antibodies
    scored on a pixel-by-pixel basis as determined from a single section of
    human tonsil. Antibody 2 performs poorly in this comparison.
  </figcaption>
</figure>

Efforts to date do not constitute a sufficient level of testing or validation
for clinical studies and patterns of staining described in this site or in our
publications should therefore be considered illustrative of the t-CyCIF approach
rather than definitive descriptions. We are currently assembling an OMERO
(https://www.openmicroscopy.org/omero/) database of matched t-CyCIF and IHC
images across multiple tissues and knockdown cell lines to further advance
antibody validation. This date will be available near the end of 2018.

### Image processing and data analysis

Image processing and data analysis are demanding in the case of high-plex tissue
images; we use software tools developed by others supplemented by a growing
number of specialized methods (code can be found
at [our GitHub repository](https://github.com/sorgerlab/cycif/). Once cells are
segmented and turned into intensity information, tools such as t-SNE can be used
in much the same way as with mass cytometry and other high-dimensional data
(Figure 5).

<figure class="image">
    <img src="{{ "/assets/img/figure5.jpg" | absolute_url }}"
         alt="Figure 5"
         width="800">
    <figcaption>
        Figure 5: t-CyCIF of human small intestine with analysis
    </figcaption>
</figure>

### Human subjects disclaimer

Human specimens were retrieved from the archives of the Brigham and Women’s
Hospital under a discarded/excess tissue protocol as detailed in Institutional
Review Board (IRB) protocol IRB17-1688 (2018) for research deemed to “involve no
more than minimal risk to the subjects.”

### Funding

This work was made possible by NIH grants P50-GM107618, U54-HL127365 and the
Ludwig Center at Harvard.

### Publications

1. Gerdes MJ, Sevinsky CJ, Sood A, Adak S, Bello MO, Bordwell A, Can A, Corwin
   A, Dinn S, Filkins RJ, Hollman D, Kamath V, Kaanumalle S, Kenny K, Larsen M,
   Lazare M, Li Q, Lowes C, McCulloch CC, McDonough E, Montalto MC, Pang Z,
   Rittscher J, Santamaria-Pang A, Sarachan BD, Seel ML, Seppo A, Shaikh K, Sui
   Y, Zhang J, Ginty F. Highly multiplexed single-cell analysis of
   formalin-fixed, paraffin-embedded cancer tissue. Proc Natl Acad Sci U S A.
   2013 Jul 16;110(29):11982-11987. PMCID: PMC3718135

1. Lin J-R, Fallahi-Sichani M, Sorger PK. Highly multiplexed imaging of single
   cells using a high-throughput cyclic immunofluorescence method. Nat Commun.
   2015 Sep 24;6:8390. PMCID: PMC4587398

1. Lin J-R, Fallahi-Sichani M, Chen J-Y, Sorger PK. Cyclic Immunofluorescence
   (CyCIF), A Highly Multiplexed Method for Single-cell Imaging. Curr Protoc
   Chem Biol. 2016 Dec 7;8(4):251-264. PMCID: PMC5233430

1. Lin J-R, Izar B, Mei S, Wang S, Shah P, Sorger P. A simple open-source method
   for highly multiplexed imaging of single cells in tissues and tumours.
   bioRxiv. 2017 Jun 19;151738.

1. Coy S, Rashid R, Lin J-R, Du Z, Donson AM, Hankinson TC, Foreman NK, Manley
   PE, Kieran MW, Reardon DA, Sorger PK, Santagata S. Multiplexed
   Immunofluorescence Reveals Potential PD-1/PD-L1 Pathway Vulnerabilities in
   Craniopharyngioma. Neuro-Oncol. 2018 Mar 2; PMID: 29509940
