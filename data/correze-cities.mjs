/**
 * Pages villes stratégiques Corrèze — contenu différencié (pas de templates doorway).
 * Les slugs doivent exister dans CORREZE_COMMUNES.
 */
export const CORREZE_CITY_PAGES = [
  {
    slug: "brive-la-gaillarde",
    file: "debarras-brive-la-gaillarde.html",
    title: "Débarras à Brive-la-Gaillarde | Leroy du Débarras",
    desc: "Débarras de maison, appartement, garage et cave à Brive-la-Gaillarde et agglomération. Tri, évacuation et devis en Corrèze.",
    h1: "Débarras à Brive-la-Gaillarde",
    lede: "Première ville de Corrèze : volumes urbains, lotissements et dépendances. Leroy du Débarras intervient pour vider, trier et évacuer selon l’accès réel du chantier.",
    angle:
      "À Brive-la-Gaillarde, les chantiers mêlent souvent appartement ou maison de lotissement, cave, garage et stationnement à anticiper. La proximité des axes (A20, A89) facilite l’évacuation lorsque le volume le justifie.",
    housing: [
      "Appartements et maisons de quartier",
      "Garages et caves d’immeuble",
      "Débarras partiel (une pièce, un grenier)",
      "Évacuation d’encombrants après déménagement",
    ],
    nearby: ["malemort", "cosnac", "ussac", "donzenac", "objat", "saint-pantaleon-de-larche"],
    faq: [
      {
        q: "Intervenez-vous dans toute l’agglomération de Brive ?",
        a: "Oui, pour Brive-la-Gaillarde et les communes proches (Malemort, Cosnac, Ussac, Donzenac, etc.). Indiquez la commune exacte et l’accès dans le formulaire de devis.",
      },
      {
        q: "Faites-vous le débarras d’appartement à Brive ?",
        a: "Oui. Étages, ascenseur, parties communes et cave d’immeuble se précisent au devis : le volume compte autant que le parcours de descente.",
      },
    ],
    img: "goulotte-chantier",
  },
  {
    slug: "tulle",
    file: "debarras-tulle.html",
    title: "Débarras à Tulle | Leroy du Débarras en Corrèze",
    desc: "Débarras de maison et appartement à Tulle : tri, évacuation, caves et accès en pente. Devis Leroy du Débarras, Corrèze.",
    h1: "Débarras à Tulle",
    lede: "Préfecture de la Corrèze, Tulle concentre logements en vallée, accès parfois étroits et dépendances à vider avec méthode.",
    angle:
      "À Tulle, le relief et les rues étroites changent le temps de chargement. Un devis clair sur l’étage, le stationnement et le type de biens évite les mauvaises surprises le jour J.",
    housing: [
      "Maisons de centre et faubourgs",
      "Appartements en pente",
      "Caves et greniers",
      "Débarras après succession",
    ],
    nearby: ["naves", "chameyrat", "laguenne-sur-avalouze", "sainte-fortunade"],
    faq: [
      {
        q: "Un accès difficile à Tulle change-t-il le devis ?",
        a: "Oui. Stationnement éloigné, escalier raide ou passage étroit allongent le chantier. Décrivez l’accès dès la demande de devis.",
      },
    ],
    img: "chantier-interieur",
  },
  {
    slug: "ussel",
    file: "debarras-ussel.html",
    title: "Débarras à Ussel | Haute-Corrèze | Leroy du Débarras",
    desc: "Débarras de maison, grange et hangar à Ussel et en Haute-Corrèze. Tri, évacuation et devis Leroy du Débarras.",
    h1: "Débarras à Ussel",
    lede: "Sous-préfecture de Haute-Corrèze : maisons, granges et volumes ruraux. Intervention adaptée à la distance et au type de biens.",
    angle:
      "Autour d’Ussel, les chantiers concernent souvent des dépendances agricoles, du bois, de la ferraille ou des greniers longtemps fermés. Le tri sur place limite les allers-retours vers les filières.",
    housing: [
      "Maisons et pavillons",
      "Granges et hangars",
      "Greniers et caves",
      "Évacuation de ferraille et encombrants",
    ],
    nearby: ["meymac", "bort-les-orgues", "neuvic"],
    faq: [
      {
        q: "Videz-vous les granges autour d’Ussel ?",
        a: "Oui. Grange, hangar ou garage isolé : on précise le volume, les objets lourds et l’accès engins ou remorque au devis.",
      },
    ],
    img: "encombrants",
  },
  {
    slug: "uzerche",
    file: "debarras-uzerche.html",
    title: "Débarras à Uzerche | Ouest Corrèze | Leroy du Débarras",
    desc: "Débarras de maison et dépendance à Uzerche et à l’ouest de la Corrèze. Évacuation, tri et devis gratuit.",
    h1: "Débarras à Uzerche",
    lede: "Bourg de la Vézère : maisons de village, caves et accès à anticiper. Leroy du Débarras organise tri et évacuation selon le chantier.",
    angle:
      "À Uzerche, le centre ancien et les maisons de village demandent souvent un chargement fractionné. Les communes de l’ouest corrézien se traitent dans la même logique de devis personnalisé.",
    housing: [
      "Maisons de bourg",
      "Caves et combles",
      "Garages",
      "Débarras après déménagement",
    ],
    nearby: ["vigeois", "lubersac", "objat"],
    faq: [
      {
        q: "Intervenez-vous aussi vers Objat ou Lubersac ?",
        a: "Oui, selon le chantier. Indiquez la commune : le déplacement se discute avec le volume à évacuer.",
      },
    ],
    img: "chantier-exterieur",
  },
  {
    slug: "egletons",
    file: "debarras-egletons.html",
    title: "Débarras à Égletons | Est Corrèze | Leroy du Débarras",
    desc: "Débarras de maison, grange et garage à Égletons et alentours. Entreprise basée près de Marcillac-la-Croisille.",
    h1: "Débarras à Égletons",
    lede: "Secteur Est déjà familier : Égletons et communes du plateau. Interventions locales pour débarras, nettoyage et évacuation.",
    angle:
      "Égletons se situe à courte distance de la base de Marcillac-la-Croisille. Les chantiers y combinent souvent maison, garage et abords, avec un temps de route maîtrisé.",
    housing: [
      "Maisons et pavillons",
      "Garages et granges",
      "Pièces encombrées",
      "Travaux extérieurs et végétaux",
    ],
    nearby: ["rosiers-d-egletons", "correze", "marcillac-la-croisille", "chaumeil"],
    faq: [
      {
        q: "Êtes-vous basés près d’Égletons ?",
        a: "L’entreprise est basée à Marcillac-la-Croisille, à proximité du secteur d’Égletons. Les déplacements y sont fréquents.",
      },
    ],
    img: "outils-nettoyage",
  },
  {
    slug: "meymac",
    file: "debarras-meymac.html",
    title: "Débarras à Meymac | Plateau | Leroy du Débarras",
    desc: "Débarras de maison et grange à Meymac, en Haute-Corrèze. Tri, évacuation et devis Leroy du Débarras.",
    h1: "Débarras à Meymac",
    lede: "Commune du plateau : maisons, granges et volumes parfois isolés. Organisation du chantier selon l’accès et la saison.",
    angle:
      "À Meymac, les biens à évacuer viennent souvent de granges ou de maisons longtemps fermées. Le tri (ferraille, bois, encombrants) évite de tout mélanger en une seule charge.",
    housing: [
      "Maisons",
      "Granges",
      "Hangars",
      "Évacuation de végétaux sur terrain",
    ],
    nearby: ["ussel", "neuvic", "bort-les-orgues"],
    faq: [
      {
        q: "Proposez-vous aussi le débroussaillage à Meymac ?",
        a: "Oui, lorsque le chantier le demande : débroussaillage, tonte, enlèvement de végétaux, en complément d’un débarras ou seul.",
      },
    ],
    img: "chantier-arbre",
  },
  {
    slug: "argentat-sur-dordogne",
    file: "debarras-argentat-sur-dordogne.html",
    title: "Débarras à Argentat-sur-Dordogne | Leroy du Débarras",
    desc: "Débarras de maison, dépendance et garage à Argentat-sur-Dordogne. Évacuation et nettoyage en vallée de la Dordogne corrézienne.",
    h1: "Débarras à Argentat-sur-Dordogne",
    lede: "Vallée de la Dordogne : maisons, dépendances et chantiers mixtes intérieur / extérieur. Devis selon le volume et l’accès.",
    angle:
      "Argentat-sur-Dordogne et les communes de rive cumulent souvent débarras intérieur et remise en ordre des abords. L’évacuation tient compte du stationnement et du type de charge.",
    housing: [
      "Maisons",
      "Garages et caves",
      "Dépendances",
      "Nettoyage après débarras",
    ],
    nearby: ["saint-privat", "beaulieu-sur-dordogne", "servieres-le-chateau"],
    faq: [
      {
        q: "Intervenez-vous aussi vers Beaulieu-sur-Dordogne ?",
        a: "Oui, selon le chantier et la distance. Décrivez la commune et le volume pour confirmer l’intervention.",
      },
    ],
    img: "brouette",
  },
  {
    slug: "bort-les-orgues",
    file: "debarras-bort-les-orgues.html",
    title: "Débarras à Bort-les-Orgues | Leroy du Débarras",
    desc: "Débarras de maison et grange à Bort-les-Orgues, nord-est de la Corrèze. Tri et évacuation, devis Leroy du Débarras.",
    h1: "Débarras à Bort-les-Orgues",
    lede: "Nord-est corrézien : maisons, granges et volumes à planifier avec le déplacement. Tri et évacuation selon les filières adaptées.",
    angle:
      "À Bort-les-Orgues, la distance depuis Marcillac-la-Croisille se justifie surtout pour des volumes clairs. Un échange photos / description aide à caler le devis avant le déplacement.",
    housing: [
      "Maisons",
      "Granges",
      "Garages",
      "Évacuation d’encombrants",
    ],
    nearby: ["ussel", "meymac", "neuvic"],
    faq: [
      {
        q: "Le déplacement jusqu’à Bort est-il toujours possible ?",
        a: "Il se discute selon le volume et la prestation. Contactez-nous avec la commune et une description du chantier.",
      },
    ],
    img: "chantier-exterieur",
  },
  {
    slug: "malemort",
    file: "debarras-malemort.html",
    title: "Débarras à Malemort | Agglomération de Brive",
    desc: "Débarras de maison, appartement et garage à Malemort, près de Brive-la-Gaillarde. Devis Leroy du Débarras en Corrèze.",
    h1: "Débarras à Malemort",
    lede: "Commune de l’agglomération de Brive : pavillons, appartements et garages. Intervention locale pour tri et évacuation.",
    angle:
      "Malemort concentre beaucoup de maisons récentes et de garages encombrés. Les chantiers y sont souvent plus accessibles qu’en centre ancien, ce qui accélère le chargement lorsque l’accès est libre.",
    housing: [
      "Pavillons",
      "Appartements",
      "Garages",
      "Caves",
    ],
    nearby: ["brive-la-gaillarde", "cosnac", "ussac"],
    faq: [
      {
        q: "Est-ce le même service qu’à Brive ?",
        a: "Oui : mêmes prestations (débarras, tri, évacuation, nettoyage si demandé), avec un devis adapté à votre adresse à Malemort.",
      },
    ],
    img: "encombrants",
  },
  {
    slug: "objat",
    file: "debarras-objat.html",
    title: "Débarras à Objat | Ouest Corrèze | Leroy du Débarras",
    desc: "Débarras de maison et garage à Objat et dans l’ouest corrézien. Évacuation des encombrants, devis gratuit.",
    h1: "Débarras à Objat",
    lede: "Ouest du bassin de Brive : maisons, garages et dépendances. Leroy du Débarras assure tri et évacuation sur devis.",
    angle:
      "Objat et ses alentours voient souvent des débarras de garage, de cave ou de maison après déménagement. Le volume se précise avec photos et description d’accès.",
    housing: [
      "Maisons",
      "Garages",
      "Caves",
      "Débarras après déménagement",
    ],
    nearby: ["brive-la-gaillarde", "uzerche", "donzenac"],
    faq: [
      {
        q: "Videz-vous seulement un garage à Objat ?",
        a: "Oui. Un débarras peut être partiel : garage, cave ou une seule pièce.",
      },
    ],
    img: "brouette",
  },
  {
    slug: "cosnac",
    file: "debarras-cosnac.html",
    title: "Débarras à Cosnac | Près de Brive | Leroy du Débarras",
    desc: "Débarras de maison et garage à Cosnac, près de Brive-la-Gaillarde. Tri, évacuation et devis en Corrèze.",
    h1: "Débarras à Cosnac",
    lede: "Commune proche de Brive : maisons, garages et terrains. Intervention pour débarras, nettoyage et évacuation.",
    angle:
      "À Cosnac, les chantiers concernent souvent des pavillons avec garage ou abords à remettre en état. Un nettoyage extérieur peut compléter le débarras si besoin.",
    housing: [
      "Maisons",
      "Garages",
      "Greniers",
      "Abords et végétaux",
    ],
    nearby: ["brive-la-gaillarde", "malemort", "turenne"],
    faq: [
      {
        q: "Faites-vous le nettoyage de terrain à Cosnac ?",
        a: "Oui, pour le débroussaillage, la tonte et l’enlèvement de végétaux, seul ou après un débarras.",
      },
    ],
    img: "chantier-arbre",
  },
  {
    slug: "saint-pantaleon-de-larche",
    file: "debarras-saint-pantaleon-de-larche.html",
    title: "Débarras à Saint-Pantaléon-de-Larche | Leroy du Débarras",
    desc: "Débarras de maison, cave et garage à Saint-Pantaléon-de-Larche, agglomération de Brive. Devis en Corrèze.",
    h1: "Débarras à Saint-Pantaléon-de-Larche",
    lede: "Ouest de l’agglomération de Brive : maisons, caves et garages. Tri et évacuation selon l’accès du chantier.",
    angle:
      "Saint-Pantaléon-de-Larche se traite comme un chantier d’agglomération : accès voitures, volumes domestiques, parfois cave ou garage très remplis. Le devis reste lié au volume réel.",
    housing: [
      "Maisons",
      "Caves",
      "Garages",
      "Évacuation d’encombrants",
    ],
    nearby: ["brive-la-gaillarde", "malemort", "objat"],
    faq: [
      {
        q: "Intervenez-vous rapidement sur Saint-Pantaléon-de-Larche ?",
        a: "Les délais dépendent du planning et du volume. Décrivez le besoin via le formulaire : nous revenons vers vous pour caler l’intervention.",
      },
    ],
    img: "chantier-interieur",
  },
  {
    slug: "marcillac-la-croisille",
    file: "debarras-marcillac-la-croisille.html",
    title: "Débarras à Marcillac-la-Croisille | Leroy du Débarras",
    desc: "Entreprise de débarras basée à Marcillac-la-Croisille : maisons, granges, garages, nettoyage et évacuation en Corrèze.",
    h1: "Débarras à Marcillac-la-Croisille",
    lede: "Commune d’attache de Leroy du Débarras : interventions locales prioritaires pour débarras, nettoyage, tri et évacuation.",
    angle:
      "Basée à Marcillac-la-Croisille, l’entreprise connaît les accès locaux, les granges du secteur et les communes immédiatement voisines. Les chantiers de proximité restent le cœur de l’activité.",
    housing: [
      "Maisons",
      "Granges et hangars",
      "Garages et caves",
      "Travaux extérieurs",
    ],
    nearby: ["egletons", "champagnac-la-noaille", "saint-pardoux-la-croisille", "gimel-les-cascades"],
    faq: [
      {
        q: "Où est basée l’entreprise ?",
        a: "À Marcillac-la-Croisille (19320), en Corrèze. Les communes alentours et le reste du département se traitent selon le chantier.",
      },
    ],
    img: "outils-nettoyage",
  },
];
