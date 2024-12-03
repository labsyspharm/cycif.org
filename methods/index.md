---
title: Methods and Reagents
redirect_to:
  - https://www.tissue-atlas.org/methods
---

## The t-CyCIF Process

In t-CyCIF, a form of 
<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3718135/" target="_blank">
multi-round multiplex tissue immunofluorescence</a>, 
~5 µm thick sections are cut from FFPE blocks, the standard in most
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

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:800px" class="d-inline-block">
        <img src="{{ "/assets/img/figure1.jpg" | absolute_url }}"
            alt="Figure 1"
            class="figure-img img-fluid">
        <figcaption class="figure-caption text-white">
            Figure 1: Assembling a high-plex t-CyCIF image using an
            iterative process
        </figcaption>
    </div>
</figure>

<div class="text-center mx-1 my-4 m-md-5">
    <div class="embed-responsive embed-responsive-1by1 d-inline-block" style="max-width:400px">
        <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/269904895"></iframe>
    </div>
</div>

## Imaging

Imaging of t-CyCIF specimens can be performed on a variety of fluorescent
microscopes each of which represent a different tradeoff between data
acquisition time, image resolution and sensitivity (Figure 2). Specimens several
square centimeters in area are often examined at a resolution of ~1 µm on slide
scanners, but high resolution image is obtained using confocal or structured
illumination microscopes.

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:500px" class="d-inline-block">
        <img src="{{ "/assets/img/figure2.jpg" | absolute_url }}"
            alt="Figure 2"
            class="figure-img img-fluid">
        <figcaption class="figure-caption text-white">
            Figure 2: t-CyCIF of a metastatic melanoma at different resolutions
        </figcaption>
    </div>
</figure>

## Antibodies for tissue-based CyCIF

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

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:800px" class="d-inline-block">
        <img src="{{ "/assets/img/figure3.jpg" | absolute_url }}"
            alt="Figure 3"
            class="figure-img img-fluid">
        <figcaption class="figure-caption text-white">
            Figure 3: Anti-PD1 staining in two successive sections of human tonsil
            by t-CyCIF on the left and IHC in the middle; DNA stained in blue. Right
            panel shows fraction of positive cells for several antibodies by the
            t-CyCIF and IHC.
        </figcaption>
    </div>
</figure>

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:300px" class="d-inline-block">
        <img src="{{ "/assets/img/figure4.jpg" | absolute_url }}"
            alt="Figure 4"
            class="figure-img img-fluid">
        <figcaption class="figure-caption text-white">
            Figure 4: Correlation of anti-PD1 staining by four different antibodies
        scored on a pixel-by-pixel basis as determined from a single section of
        human tonsil. Antibody 2 performs poorly in this comparison.
        </figcaption>
    </div>
</figure>

Efforts to date do not constitute a sufficient level of testing or validation
for clinical studies and patterns of staining described in this site or in our
publications should therefore be considered illustrative of the t-CyCIF approach
rather than definitive descriptions. We are currently assembling an [OMERO](https://www.openmicroscopy.org/omero/) 
database of matched t-CyCIF and IHC
images across multiple tissues and knockdown cell lines to further advance
antibody validation. This date will be available near the end of 2018.

## Image processing and data analysis

Image processing and data analysis are demanding in the case of high-plex tissue
images; we use software tools developed by others supplemented by a growing
number of specialized methods (code can be found
at [our GitHub repository](https://github.com/sorgerlab/cycif/). Once cells are
segmented and turned into intensity information, tools such as t-SNE can be used
in much the same way as with mass cytometry and other high-dimensional data
(Figure 5).

<figure class="image text-center mx-1 my-4 m-md-5">
    <div style="max-width:800px" class="d-inline-block">
        <img src="{{ "/assets/img/figure5.jpg" | absolute_url }}"
            alt="Figure 5"
            class="figure-img img-fluid">
        <figcaption class="figure-caption text-white">
            Figure 5: t-CyCIF of human small intestine with analysis
        </figcaption>
    </div>
</figure>

## Human subjects disclaimer

Human specimens were retrieved from the archives of the Brigham and Women’s
Hospital under a discarded/excess tissue protocol as detailed in Institutional
Review Board (IRB) protocol IRB17-1688 (2018) for research deemed to “involve no
more than minimal risk to the subjects.”

## Funding

This work was made possible by NIH grants P50-GM107618, U54-HL127365, U2C-CA233262, U2C-CA233280, U54-CA225088, the Ludwig Center at Harvard, and the Ludwig Cancer Research Foundation.
