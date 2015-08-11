#Integration assets

## GMAP
Ce composant présente une interface facile à utiliser qui permet de gérer une carte Goole map.




## TEMPLATE DES FORMULAIRES
Ce composant présente un template HTML simple et facile à utiliser qui permet de générer une vaste variété des formulaires en HTML.

### Objectif

L'idée est d'unifier le code HTML qui permet de créer vos formulaires, afin de simplifier ensuite les corrections et les mises à jour de ce dernier.

Dans ce projet, vous trouvez un exemple du code HTML responsive, simple à apprendre et à utiliser.

### Usage

Tout d'abord, Veuillez inclure le ficher__forms.css_ dans vos projets. Ensuite, créer vos formulaires en respectant la structure HTML proposé dans le template (Voir le code source en plus bas).

```<form method="post" class="" > 
	<!-- form row template start -->
	<div class="formField">
		<label for="itemId" class="required" >label texte </label>
		<div class="formControl">
			<input type="text" name="itemName" id="itemId" value="" />
			<span class="messageBox error">Message... </span>
		</div>
	</div>
	<!-- form row template end -->



</form>```

### Paramétrage

#### Direction

En ajoutant la classe *rtl* à une balise supérieur à notre formulaire. Le formulaire vient de changer leur direction avec tous ces composants intégrés.

```<body class="rtl" >```

#### Formulaire mode (horizontale/verticale)

Dans ce composant les formulaires est par defaut en mode verticale. en ajouter la classe *horizontalForm* à notre formulaire, ce dernier vient de changer sa mode d'affichage.

```<form method="post" class="horizontalForm" >```

#### élément sans label

Afin d'afficher un élément (input texte par exemple) du formulaire qui n'a pas de label, il suffit de n'a pas mettre le label dans le code HTML, et le style s’adapte. 

```<div class="formField">
	<div class="formControl">
		<!-- supprimer la balise label du code HTML -->
		<input type="text" name="itemName" id="itemId" value="" />
	</div>
</div>``` 

#### Le style des labels obligatoire

Dans ce composant, le style par defaut des labels obligatoires est un étoile rouge à côté chaque label. Afin d'afficher cette étoile il suffit d'ajouter la classe *required* aux labels en question.

_NB. Vous pouvez intervenir sur le style des labels obligatoires dans le fichier forms.css suivant le besoin de vos projets._

```<label class="required" >label texte </label>```

#### Les tailles des labels

Dans ce composant, nous définissons quatre tailles différent pour un label *default*, *small*, *meduim*, *large*, afin d'utiliser un de ces tailles il suffit d'ajouter la classe qui correspond à une taille si à la formulaire pour définir les tailles de tous les labels dedans, ou bien au balise parent du label même dont la classe est *formField* pour définir leur taille.

_NB. Vous pouvez intervenir sur ces tailles dans le fichier forms.css suivant le besoin de vos projets._

```<form method="post" class="mediumLabel" > 
	<!-- form row template start -->
	<div class="formField">
		<label class="required" >label texte </label>
		...
	</div>
	<!-- form row template end -->
	...
</form>```

Ou bien

```<form method="post" > 
	<!-- form row template start -->
	<div class="formField mediumLabel">
		<label class="required" >label texte </label>
		...
	</div>
	<!-- form row template end -->
	...
</form>```

#### Label direction

Afin de changer le direction des label en mettant un alignement droite, vous pouvez ajouter la classe "rightLabels" au formulaire.

```<form method="post" class="rightLabels" >```

#### Taille des éléments
Vous pouvez utiliser les classes *small*, *medium*, *large*, *full* avec les boutons, comme avec les éléments du formulaire afin de définir la taille prévu de ces éléments

```<input type="submit" name="send" class="btn full" value="OK" />```

```<div class="formField small"> ... </div>```

#### Un ensemble des éléments

Afin d'afficher un ensemble des éléments (comme exemple une liste des options radio, ou bien une liste des zones de texte à côté) vous pouvez utiliser la structure suivant:

1. Une liste des éléments verticale:

```<div class="formField">
	<label for="tel" class="required">Champ tel</label>
	<div class="formControl inlineOptions">
		<div class="optionItem">
			<input type="tel" name="telS" id="telS" placeholder="555" maxlength="3" class="mainControl small" value="" />
		</div>
		<div class="optionItem">
			<input type="tel" name="tel" id="tel" class="mainControl large" value="" />
		</div>
	</div>
</div>```

2. Une liste des éléments horizontale: 

```<div class="formField">
	<label for="item2">Radios block</label>
	<div class="formControl blockOptions customCheckbox">   
		<div class="optionItem">
			<input type="checkbox" name="checkboxField2" id="checkboxField1" value="4" />
			<label for="checkboxField1">Radio Field 4</label>
		</div>
		<div class="optionItem">
			<input type="checkbox" name="checkboxField2" id="checkboxField2" value="5" />
			<label for="checkboxField2">Radio Field 5</label>
		</div>
		<div class="optionItem">
			<input type="checkbox" name="checkboxField2" id="checkboxField3" value="6" />
			<label for="checkboxField3">Radio Field 6</label>
		</div>
	</div>
</div>```
