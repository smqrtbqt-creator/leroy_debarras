/**
 * Données Corrèze (département 19) — générées depuis geo.api.gouv.fr
 * Ne pas éditer les communes à la main : relancer tools/build-correze-data.mjs
 * Source: data/correze-communes-raw.json (277 communes)
 */
export const CORREZE_DEPARTMENT = {
  code: "19",
  name: "Corrèze",
  hubPath: "/debarras-correze.html",
};

export const CORREZE_SECTORS = [
  {
    "id": "brive",
    "name": "Brive-la-Gaillarde et son agglomération",
    "blurb": "Bassin densément peuplé du sud-ouest : maisons de lotissement, appartements, caves et garages, accès souvent facilités par les grands axes."
  },
  {
    "id": "tulle",
    "name": "Tulle et bassin de Tulle",
    "blurb": "Préfecture et vallée de la Corrèze : logements en pente, accès parfois étroits, dépendances et pièces à vider au cas par cas."
  },
  {
    "id": "ussel",
    "name": "Ussel et Haute-Corrèze",
    "blurb": "Nord-est du département, moyenne montagne : granges, hangars, volumes ruraux et chantiers plus exposés au climat."
  },
  {
    "id": "uzerche",
    "name": "Uzerche et Ouest Corrézien",
    "blurb": "Ouest du département, autour de la Vézère : bourgs historiques, maisons de village et accès à préparer au devis."
  },
  {
    "id": "egletons",
    "name": "Égletons et secteur Est",
    "blurb": "Est Corrézien, plateau et communes autour d’Égletons : interventions locales déjà habituelles pour Leroy du Débarras."
  },
  {
    "id": "dordogne",
    "name": "Vallée de la Dordogne",
    "blurb": "Sud-est : Argentat-sur-Dordogne et communes de rive, souvent des volumes mixtes (maison, dépendance, extérieur)."
  },
  {
    "id": "sud",
    "name": "Sud Corrèze",
    "blurb": "Sud du bassin de Brive et collines : villages, maisons de caractère, garages et terrains à remettre en ordre."
  },
  {
    "id": "plateau",
    "name": "Plateau de Millevaches et nord",
    "blurb": "Nord du département : communes rurales, granges et hangars, distances plus longues à préciser au devis."
  }
];

export const CORREZE_COMMUNES = [
  {
    "name": "Affieux",
    "slug": "affieux",
    "code": "19001",
    "postalCodes": [
      "19260"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Aix",
    "slug": "aix",
    "code": "19002",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Albignac",
    "slug": "albignac",
    "code": "19003",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Albussac",
    "slug": "albussac",
    "code": "19004",
    "postalCodes": [
      "19380"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Allassac",
    "slug": "allassac",
    "code": "19005",
    "postalCodes": [
      "19240"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Alleyrat",
    "slug": "alleyrat",
    "code": "19006",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Altillac",
    "slug": "altillac",
    "code": "19007",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Ambrugeat",
    "slug": "ambrugeat",
    "code": "19008",
    "postalCodes": [
      "19250"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Argentat-sur-Dordogne",
    "slug": "argentat-sur-dordogne",
    "code": "19010",
    "postalCodes": [
      "19320",
      "19400"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Arnac-Pompadour",
    "slug": "arnac-pompadour",
    "code": "19011",
    "postalCodes": [
      "19230"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Astaillac",
    "slug": "astaillac",
    "code": "19012",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Aubazines",
    "slug": "aubazines",
    "code": "19013",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Auriac",
    "slug": "auriac",
    "code": "19014",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Ayen",
    "slug": "ayen",
    "code": "19015",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Bar",
    "slug": "bar",
    "code": "19016",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Bassignac-le-Bas",
    "slug": "bassignac-le-bas",
    "code": "19017",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Bassignac-le-Haut",
    "slug": "bassignac-le-haut",
    "code": "19018",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Beaulieu-sur-Dordogne",
    "slug": "beaulieu-sur-dordogne",
    "code": "19019",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Beaumont",
    "slug": "beaumont",
    "code": "19020",
    "postalCodes": [
      "19390"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Bellechassagne",
    "slug": "bellechassagne",
    "code": "19021",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Benayes",
    "slug": "benayes",
    "code": "19022",
    "postalCodes": [
      "19510"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Beynat",
    "slug": "beynat",
    "code": "19023",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Beyssac",
    "slug": "beyssac",
    "code": "19024",
    "postalCodes": [
      "19230"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Beyssenac",
    "slug": "beyssenac",
    "code": "19025",
    "postalCodes": [
      "19230"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Bilhac",
    "slug": "bilhac",
    "code": "19026",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Bonnefond",
    "slug": "bonnefond",
    "code": "19027",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Bort-les-Orgues",
    "slug": "bort-les-orgues",
    "code": "19028",
    "postalCodes": [
      "19110"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Branceilles",
    "slug": "branceilles",
    "code": "19029",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Brignac-la-Plaine",
    "slug": "brignac-la-plaine",
    "code": "19030",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Brive-la-Gaillarde",
    "slug": "brive-la-gaillarde",
    "code": "19031",
    "postalCodes": [
      "19100"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Bugeat",
    "slug": "bugeat",
    "code": "19033",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Camps-Saint-Mathurin-Léobazel",
    "slug": "camps-saint-mathurin-leobazel",
    "code": "19034",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Chabrignac",
    "slug": "chabrignac",
    "code": "19035",
    "postalCodes": [
      "19350"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Chamberet",
    "slug": "chamberet",
    "code": "19036",
    "postalCodes": [
      "19370"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Chamboulive",
    "slug": "chamboulive",
    "code": "19037",
    "postalCodes": [
      "19450"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Chameyrat",
    "slug": "chameyrat",
    "code": "19038",
    "postalCodes": [
      "19330"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Champagnac-la-Noaille",
    "slug": "champagnac-la-noaille",
    "code": "19039",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Champagnac-la-Prune",
    "slug": "champagnac-la-prune",
    "code": "19040",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Chanac-les-Mines",
    "slug": "chanac-les-mines",
    "code": "19041",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Chanteix",
    "slug": "chanteix",
    "code": "19042",
    "postalCodes": [
      "19330"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Chapelle-Spinasse",
    "slug": "chapelle-spinasse",
    "code": "19046",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Chartrier-Ferrière",
    "slug": "chartrier-ferriere",
    "code": "19047",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Chasteaux",
    "slug": "chasteaux",
    "code": "19049",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Chauffour-sur-Vell",
    "slug": "chauffour-sur-vell",
    "code": "19050",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Chaumeil",
    "slug": "chaumeil",
    "code": "19051",
    "postalCodes": [
      "19390"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Chavanac",
    "slug": "chavanac",
    "code": "19052",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Chaveroche",
    "slug": "chaveroche",
    "code": "19053",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Chenailler-Mascheix",
    "slug": "chenailler-mascheix",
    "code": "19054",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Chirac-Bellevue",
    "slug": "chirac-bellevue",
    "code": "19055",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Clergoux",
    "slug": "clergoux",
    "code": "19056",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Collonges-la-Rouge",
    "slug": "collonges-la-rouge",
    "code": "19057",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Combressol",
    "slug": "combressol",
    "code": "19058",
    "postalCodes": [
      "19250"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Concèze",
    "slug": "conceze",
    "code": "19059",
    "postalCodes": [
      "19350"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Condat-sur-Ganaveix",
    "slug": "condat-sur-ganaveix",
    "code": "19060",
    "postalCodes": [
      "19140"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Confolent-Port-Dieu",
    "slug": "confolent-port-dieu",
    "code": "19167",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Cornil",
    "slug": "cornil",
    "code": "19061",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Corrèze",
    "slug": "correze",
    "code": "19062",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Cosnac",
    "slug": "cosnac",
    "code": "19063",
    "postalCodes": [
      "19360"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Couffy-sur-Sarsonne",
    "slug": "couffy-sur-sarsonne",
    "code": "19064",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Courteix",
    "slug": "courteix",
    "code": "19065",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Cublac",
    "slug": "cublac",
    "code": "19066",
    "postalCodes": [
      "19520"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Curemonte",
    "slug": "curemonte",
    "code": "19067",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Dampniat",
    "slug": "dampniat",
    "code": "19068",
    "postalCodes": [
      "19360"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Darazac",
    "slug": "darazac",
    "code": "19069",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Darnets",
    "slug": "darnets",
    "code": "19070",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Davignac",
    "slug": "davignac",
    "code": "19071",
    "postalCodes": [
      "19250"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Donzenac",
    "slug": "donzenac",
    "code": "19072",
    "postalCodes": [
      "19270"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Égletons",
    "slug": "egletons",
    "code": "19073",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Espagnac",
    "slug": "espagnac",
    "code": "19075",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Espartignac",
    "slug": "espartignac",
    "code": "19076",
    "postalCodes": [
      "19140"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Estivals",
    "slug": "estivals",
    "code": "19077",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Estivaux",
    "slug": "estivaux",
    "code": "19078",
    "postalCodes": [
      "19410"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Eyburie",
    "slug": "eyburie",
    "code": "19079",
    "postalCodes": [
      "19140"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Eygurande",
    "slug": "eygurande",
    "code": "19080",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Eyrein",
    "slug": "eyrein",
    "code": "19081",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Favars",
    "slug": "favars",
    "code": "19082",
    "postalCodes": [
      "19330"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Feyt",
    "slug": "feyt",
    "code": "19083",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Forgès",
    "slug": "forges",
    "code": "19084",
    "postalCodes": [
      "19380"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Gimel-les-Cascades",
    "slug": "gimel-les-cascades",
    "code": "19085",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Goulles",
    "slug": "goulles",
    "code": "19086",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Gourdon-Murat",
    "slug": "gourdon-murat",
    "code": "19087",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Grandsaigne",
    "slug": "grandsaigne",
    "code": "19088",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Gros-Chastang",
    "slug": "gros-chastang",
    "code": "19089",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Gumond",
    "slug": "gumond",
    "code": "19090",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Hautefage",
    "slug": "hautefage",
    "code": "19091",
    "postalCodes": [
      "19400"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Jugeals-Nazareth",
    "slug": "jugeals-nazareth",
    "code": "19093",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Juillac",
    "slug": "juillac",
    "code": "19094",
    "postalCodes": [
      "19350"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "L'Église-aux-Bois",
    "slug": "l-eglise-aux-bois",
    "code": "19074",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "La Chapelle-aux-Brocs",
    "slug": "la-chapelle-aux-brocs",
    "code": "19043",
    "postalCodes": [
      "19360"
    ],
    "sectorId": "brive"
  },
  {
    "name": "La Chapelle-aux-Saints",
    "slug": "la-chapelle-aux-saints",
    "code": "19044",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "La Chapelle-Saint-Géraud",
    "slug": "la-chapelle-saint-geraud",
    "code": "19045",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "La Roche-Canillac",
    "slug": "la-roche-canillac",
    "code": "19174",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Lacelle",
    "slug": "lacelle",
    "code": "19095",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Ladignac-sur-Rondelles",
    "slug": "ladignac-sur-rondelles",
    "code": "19096",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Lafage-sur-Sombre",
    "slug": "lafage-sur-sombre",
    "code": "19097",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Lagarde-Marc-la-Tour",
    "slug": "lagarde-marc-la-tour",
    "code": "19098",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Lagleygeolle",
    "slug": "lagleygeolle",
    "code": "19099",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Lagraulière",
    "slug": "lagrauliere",
    "code": "19100",
    "postalCodes": [
      "19700"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Laguenne-sur-Avalouze",
    "slug": "laguenne-sur-avalouze",
    "code": "19101",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Lamazière-Basse",
    "slug": "lamaziere-basse",
    "code": "19102",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Lamazière-Haute",
    "slug": "lamaziere-haute",
    "code": "19103",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Lamongerie",
    "slug": "lamongerie",
    "code": "19104",
    "postalCodes": [
      "19510"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Lanteuil",
    "slug": "lanteuil",
    "code": "19105",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Lapleau",
    "slug": "lapleau",
    "code": "19106",
    "postalCodes": [
      "19550"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Larche",
    "slug": "larche",
    "code": "19107",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Laroche-près-Feyt",
    "slug": "laroche-pres-feyt",
    "code": "19108",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Lascaux",
    "slug": "lascaux",
    "code": "19109",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Latronche",
    "slug": "latronche",
    "code": "19110",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Laval-sur-Luzège",
    "slug": "laval-sur-luzege",
    "code": "19111",
    "postalCodes": [
      "19550"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Le Chastang",
    "slug": "le-chastang",
    "code": "19048",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Le Lonzac",
    "slug": "le-lonzac",
    "code": "19118",
    "postalCodes": [
      "19470"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Le Pescher",
    "slug": "le-pescher",
    "code": "19163",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Les Angles-sur-Corrèze",
    "slug": "les-angles-sur-correze",
    "code": "19009",
    "postalCodes": [
      "19000"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Les Trois-Saints",
    "slug": "les-trois-saints",
    "code": "19248",
    "postalCodes": [
      "19140",
      "19210"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Lestards",
    "slug": "lestards",
    "code": "19112",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Liginiac",
    "slug": "liginiac",
    "code": "19113",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Lignareix",
    "slug": "lignareix",
    "code": "19114",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Ligneyrac",
    "slug": "ligneyrac",
    "code": "19115",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Liourdres",
    "slug": "liourdres",
    "code": "19116",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Lissac-sur-Couze",
    "slug": "lissac-sur-couze",
    "code": "19117",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Lostanges",
    "slug": "lostanges",
    "code": "19119",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Louignac",
    "slug": "louignac",
    "code": "19120",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Lubersac",
    "slug": "lubersac",
    "code": "19121",
    "postalCodes": [
      "19210"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Madranges",
    "slug": "madranges",
    "code": "19122",
    "postalCodes": [
      "19470"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Malemort",
    "slug": "malemort",
    "code": "19123",
    "postalCodes": [
      "19360"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Mansac",
    "slug": "mansac",
    "code": "19124",
    "postalCodes": [
      "19520"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Marcillac-la-Croisille",
    "slug": "marcillac-la-croisille",
    "code": "19125",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Marcillac-la-Croze",
    "slug": "marcillac-la-croze",
    "code": "19126",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Margerides",
    "slug": "margerides",
    "code": "19128",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Masseret",
    "slug": "masseret",
    "code": "19129",
    "postalCodes": [
      "19510"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Maussac",
    "slug": "maussac",
    "code": "19130",
    "postalCodes": [
      "19250"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Meilhards",
    "slug": "meilhards",
    "code": "19131",
    "postalCodes": [
      "19510"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Ménoire",
    "slug": "menoire",
    "code": "19132",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Mercœur",
    "slug": "merc-ur",
    "code": "19133",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Merlines",
    "slug": "merlines",
    "code": "19134",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Mestes",
    "slug": "mestes",
    "code": "19135",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Meymac",
    "slug": "meymac",
    "code": "19136",
    "postalCodes": [
      "19250"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Meyrignac-l'Église",
    "slug": "meyrignac-l-eglise",
    "code": "19137",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Meyssac",
    "slug": "meyssac",
    "code": "19138",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Millevaches",
    "slug": "millevaches",
    "code": "19139",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Monceaux-sur-Dordogne",
    "slug": "monceaux-sur-dordogne",
    "code": "19140",
    "postalCodes": [
      "19400"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Monestier-Merlines",
    "slug": "monestier-merlines",
    "code": "19141",
    "postalCodes": [
      "19340"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Monestier-Port-Dieu",
    "slug": "monestier-port-dieu",
    "code": "19142",
    "postalCodes": [
      "19110"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Montaignac-sur-Doustre",
    "slug": "montaignac-sur-doustre",
    "code": "19143",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Montgibaud",
    "slug": "montgibaud",
    "code": "19144",
    "postalCodes": [
      "19210"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Moustier-Ventadour",
    "slug": "moustier-ventadour",
    "code": "19145",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Naves",
    "slug": "naves",
    "code": "19146",
    "postalCodes": [
      "19460"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Nespouls",
    "slug": "nespouls",
    "code": "19147",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Neuvic",
    "slug": "neuvic",
    "code": "19148",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Neuville",
    "slug": "neuville",
    "code": "19149",
    "postalCodes": [
      "19380"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Noailhac",
    "slug": "noailhac",
    "code": "19150",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Noailles",
    "slug": "noailles",
    "code": "19151",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Nonards",
    "slug": "nonards",
    "code": "19152",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Objat",
    "slug": "objat",
    "code": "19153",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Orgnac-sur-Vézère",
    "slug": "orgnac-sur-vezere",
    "code": "19154",
    "postalCodes": [
      "19410"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Orliac-de-Bar",
    "slug": "orliac-de-bar",
    "code": "19155",
    "postalCodes": [
      "19390"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Palazinges",
    "slug": "palazinges",
    "code": "19156",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Palisse",
    "slug": "palisse",
    "code": "19157",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Pandrignes",
    "slug": "pandrignes",
    "code": "19158",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Péret-Bel-Air",
    "slug": "peret-bel-air",
    "code": "19159",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Pérols-sur-Vézère",
    "slug": "perols-sur-vezere",
    "code": "19160",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Perpezac-le-Blanc",
    "slug": "perpezac-le-blanc",
    "code": "19161",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Perpezac-le-Noir",
    "slug": "perpezac-le-noir",
    "code": "19162",
    "postalCodes": [
      "19410"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Peyrelevade",
    "slug": "peyrelevade",
    "code": "19164",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Peyrissac",
    "slug": "peyrissac",
    "code": "19165",
    "postalCodes": [
      "19260"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Pierrefitte",
    "slug": "pierrefitte",
    "code": "19166",
    "postalCodes": [
      "19450"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Pradines",
    "slug": "pradines",
    "code": "19168",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Puy-d'Arnac",
    "slug": "puy-d-arnac",
    "code": "19169",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Queyssac-les-Vignes",
    "slug": "queyssac-les-vignes",
    "code": "19170",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Reygade",
    "slug": "reygade",
    "code": "19171",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Rilhac-Treignac",
    "slug": "rilhac-treignac",
    "code": "19172",
    "postalCodes": [
      "19260"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Rilhac-Xaintrie",
    "slug": "rilhac-xaintrie",
    "code": "19173",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Roche-le-Peyroux",
    "slug": "roche-le-peyroux",
    "code": "19175",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Rosiers-d'Égletons",
    "slug": "rosiers-d-egletons",
    "code": "19176",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Rosiers-de-Juillac",
    "slug": "rosiers-de-juillac",
    "code": "19177",
    "postalCodes": [
      "19350"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Sadroc",
    "slug": "sadroc",
    "code": "19178",
    "postalCodes": [
      "19270"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saillac",
    "slug": "saillac",
    "code": "19179",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Saint-Angel",
    "slug": "saint-angel",
    "code": "19180",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Saint-Augustin",
    "slug": "saint-augustin",
    "code": "19181",
    "postalCodes": [
      "19390"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Aulaire",
    "slug": "saint-aulaire",
    "code": "19182",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Bazile-de-Meyssac",
    "slug": "saint-bazile-de-meyssac",
    "code": "19184",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Saint-Bonnet-Elvert",
    "slug": "saint-bonnet-elvert",
    "code": "19186",
    "postalCodes": [
      "19380"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Bonnet-l'Enfantier",
    "slug": "saint-bonnet-l-enfantier",
    "code": "19188",
    "postalCodes": [
      "19410"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Saint-Bonnet-la-Rivière",
    "slug": "saint-bonnet-la-riviere",
    "code": "19187",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Saint-Bonnet-les-Tours-de-Merle",
    "slug": "saint-bonnet-les-tours-de-merle",
    "code": "19189",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Bonnet-près-Bort",
    "slug": "saint-bonnet-pres-bort",
    "code": "19190",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Saint-Cernin-de-Larche",
    "slug": "saint-cernin-de-larche",
    "code": "19191",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Saint-Chamant",
    "slug": "saint-chamant",
    "code": "19192",
    "postalCodes": [
      "19380"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Cirgues-la-Loutre",
    "slug": "saint-cirgues-la-loutre",
    "code": "19193",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Clément",
    "slug": "saint-clement",
    "code": "19194",
    "postalCodes": [
      "19700"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Cyprien",
    "slug": "saint-cyprien",
    "code": "19195",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Cyr-la-Roche",
    "slug": "saint-cyr-la-roche",
    "code": "19196",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Éloy-les-Tuileries",
    "slug": "saint-eloy-les-tuileries",
    "code": "19198",
    "postalCodes": [
      "19210"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Saint-Étienne-aux-Clos",
    "slug": "saint-etienne-aux-clos",
    "code": "19199",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Étienne-la-Geneste",
    "slug": "saint-etienne-la-geneste",
    "code": "19200",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Saint-Exupéry-les-Roches",
    "slug": "saint-exupery-les-roches",
    "code": "19201",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Saint-Fréjoux",
    "slug": "saint-frejoux",
    "code": "19204",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Geniez-ô-Merle",
    "slug": "saint-geniez-o-merle",
    "code": "19205",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Germain-Lavolps",
    "slug": "saint-germain-lavolps",
    "code": "19206",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Germain-les-Vergnes",
    "slug": "saint-germain-les-vergnes",
    "code": "19207",
    "postalCodes": [
      "19330"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Hilaire-Foissac",
    "slug": "saint-hilaire-foissac",
    "code": "19208",
    "postalCodes": [
      "19550"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Hilaire-les-Courbes",
    "slug": "saint-hilaire-les-courbes",
    "code": "19209",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Hilaire-Luc",
    "slug": "saint-hilaire-luc",
    "code": "19210",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Saint-Hilaire-Peyroux",
    "slug": "saint-hilaire-peyroux",
    "code": "19211",
    "postalCodes": [
      "19560"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Hilaire-Taurieux",
    "slug": "saint-hilaire-taurieux",
    "code": "19212",
    "postalCodes": [
      "19400"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Saint-Jal",
    "slug": "saint-jal",
    "code": "19213",
    "postalCodes": [
      "19700"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Julien-aux-Bois",
    "slug": "saint-julien-aux-bois",
    "code": "19214",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Julien-le-Pèlerin",
    "slug": "saint-julien-le-pelerin",
    "code": "19215",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Julien-le-Vendômois",
    "slug": "saint-julien-le-vendomois",
    "code": "19216",
    "postalCodes": [
      "19210"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Saint-Julien-Maumont",
    "slug": "saint-julien-maumont",
    "code": "19217",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Saint-Martial-de-Gimel",
    "slug": "saint-martial-de-gimel",
    "code": "19220",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Martial-Entraygues",
    "slug": "saint-martial-entraygues",
    "code": "19221",
    "postalCodes": [
      "19400"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Martin-la-Méanne",
    "slug": "saint-martin-la-meanne",
    "code": "19222",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Merd-de-Lapleau",
    "slug": "saint-merd-de-lapleau",
    "code": "19225",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Merd-les-Oussines",
    "slug": "saint-merd-les-oussines",
    "code": "19226",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Mexant",
    "slug": "saint-mexant",
    "code": "19227",
    "postalCodes": [
      "19330"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Pantaléon-de-Lapleau",
    "slug": "saint-pantaleon-de-lapleau",
    "code": "19228",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Pantaléon-de-Larche",
    "slug": "saint-pantaleon-de-larche",
    "code": "19229",
    "postalCodes": [
      "19600"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Pardoux-l'Ortigier",
    "slug": "saint-pardoux-l-ortigier",
    "code": "19234",
    "postalCodes": [
      "19270"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Pardoux-la-Croisille",
    "slug": "saint-pardoux-la-croisille",
    "code": "19231",
    "postalCodes": [
      "19320"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Pardoux-le-Neuf",
    "slug": "saint-pardoux-le-neuf",
    "code": "19232",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Pardoux-le-Vieux",
    "slug": "saint-pardoux-le-vieux",
    "code": "19233",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Paul",
    "slug": "saint-paul",
    "code": "19235",
    "postalCodes": [
      "19150"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Priest-de-Gimel",
    "slug": "saint-priest-de-gimel",
    "code": "19236",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Privat",
    "slug": "saint-privat",
    "code": "19237",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Rémy",
    "slug": "saint-remy",
    "code": "19238",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Robert",
    "slug": "saint-robert",
    "code": "19239",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Salvadour",
    "slug": "saint-salvadour",
    "code": "19240",
    "postalCodes": [
      "19700"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Saint-Setiers",
    "slug": "saint-setiers",
    "code": "19241",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Solve",
    "slug": "saint-solve",
    "code": "19242",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Saint-Sornin-Lavolps",
    "slug": "saint-sornin-lavolps",
    "code": "19243",
    "postalCodes": [
      "19230"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Saint-Sulpice-les-Bois",
    "slug": "saint-sulpice-les-bois",
    "code": "19244",
    "postalCodes": [
      "19250"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Saint-Sylvain",
    "slug": "saint-sylvain",
    "code": "19245",
    "postalCodes": [
      "19380"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Saint-Viance",
    "slug": "saint-viance",
    "code": "19246",
    "postalCodes": [
      "19240"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Saint-Victour",
    "slug": "saint-victour",
    "code": "19247",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Saint-Yrieix-le-Déjalat",
    "slug": "saint-yrieix-le-dejalat",
    "code": "19249",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Sainte-Féréole",
    "slug": "sainte-fereole",
    "code": "19202",
    "postalCodes": [
      "19270"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Sainte-Fortunade",
    "slug": "sainte-fortunade",
    "code": "19203",
    "postalCodes": [
      "19490"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Sainte-Marie-Lapanouze",
    "slug": "sainte-marie-lapanouze",
    "code": "19219",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Salon-la-Tour",
    "slug": "salon-la-tour",
    "code": "19250",
    "postalCodes": [
      "19510"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Sarran",
    "slug": "sarran",
    "code": "19251",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Sarroux - Saint Julien",
    "slug": "sarroux-saint-julien",
    "code": "19252",
    "postalCodes": [
      "19110"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Segonzac",
    "slug": "segonzac",
    "code": "19253",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Ségur-le-Château",
    "slug": "segur-le-chateau",
    "code": "19254",
    "postalCodes": [
      "19230"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Seilhac",
    "slug": "seilhac",
    "code": "19255",
    "postalCodes": [
      "19700"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Sérandon",
    "slug": "serandon",
    "code": "19256",
    "postalCodes": [
      "19160"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Sérilhac",
    "slug": "serilhac",
    "code": "19257",
    "postalCodes": [
      "19190"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Servières-le-Château",
    "slug": "servieres-le-chateau",
    "code": "19258",
    "postalCodes": [
      "19220"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Sexcles",
    "slug": "sexcles",
    "code": "19259",
    "postalCodes": [
      "19430"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Sioniac",
    "slug": "sioniac",
    "code": "19260",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Sornac",
    "slug": "sornac",
    "code": "19261",
    "postalCodes": [
      "19290"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Soudaine-Lavinadière",
    "slug": "soudaine-lavinadiere",
    "code": "19262",
    "postalCodes": [
      "19370"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Soudeilles",
    "slug": "soudeilles",
    "code": "19263",
    "postalCodes": [
      "19300"
    ],
    "sectorId": "egletons"
  },
  {
    "name": "Soursac",
    "slug": "soursac",
    "code": "19264",
    "postalCodes": [
      "19550"
    ],
    "sectorId": "dordogne"
  },
  {
    "name": "Tarnac",
    "slug": "tarnac",
    "code": "19265",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Thalamy",
    "slug": "thalamy",
    "code": "19266",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Toy-Viam",
    "slug": "toy-viam",
    "code": "19268",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Treignac",
    "slug": "treignac",
    "code": "19269",
    "postalCodes": [
      "19260"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Troche",
    "slug": "troche",
    "code": "19270",
    "postalCodes": [
      "19230"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Tudeils",
    "slug": "tudeils",
    "code": "19271",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Tulle",
    "slug": "tulle",
    "code": "19272",
    "postalCodes": [
      "19000"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Turenne",
    "slug": "turenne",
    "code": "19273",
    "postalCodes": [
      "19500"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Ussac",
    "slug": "ussac",
    "code": "19274",
    "postalCodes": [
      "19270"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Ussel",
    "slug": "ussel",
    "code": "19275",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Uzerche",
    "slug": "uzerche",
    "code": "19276",
    "postalCodes": [
      "19140"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Valiergues",
    "slug": "valiergues",
    "code": "19277",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Varetz",
    "slug": "varetz",
    "code": "19278",
    "postalCodes": [
      "19240"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Vars-sur-Roseix",
    "slug": "vars-sur-roseix",
    "code": "19279",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "brive"
  },
  {
    "name": "Végennes",
    "slug": "vegennes",
    "code": "19280",
    "postalCodes": [
      "19120"
    ],
    "sectorId": "sud"
  },
  {
    "name": "Veix",
    "slug": "veix",
    "code": "19281",
    "postalCodes": [
      "19260"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Veyrières",
    "slug": "veyrieres",
    "code": "19283",
    "postalCodes": [
      "19200"
    ],
    "sectorId": "ussel"
  },
  {
    "name": "Viam",
    "slug": "viam",
    "code": "19284",
    "postalCodes": [
      "19170"
    ],
    "sectorId": "plateau"
  },
  {
    "name": "Vigeois",
    "slug": "vigeois",
    "code": "19285",
    "postalCodes": [
      "19410"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Vignols",
    "slug": "vignols",
    "code": "19286",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Vitrac-sur-Montane",
    "slug": "vitrac-sur-montane",
    "code": "19287",
    "postalCodes": [
      "19800"
    ],
    "sectorId": "tulle"
  },
  {
    "name": "Voutezac",
    "slug": "voutezac",
    "code": "19288",
    "postalCodes": [
      "19130"
    ],
    "sectorId": "uzerche"
  },
  {
    "name": "Yssandon",
    "slug": "yssandon",
    "code": "19289",
    "postalCodes": [
      "19310"
    ],
    "sectorId": "brive"
  }
];

export function communesBySector(sectorId) {
  return CORREZE_COMMUNES.filter((c) => c.sectorId === sectorId);
}

export function findCommune(slugOrName) {
  const key = String(slugOrName || "").toLowerCase();
  return (
    CORREZE_COMMUNES.find((c) => c.slug === key) ||
    CORREZE_COMMUNES.find((c) => c.name.toLowerCase() === key) ||
    null
  );
}
