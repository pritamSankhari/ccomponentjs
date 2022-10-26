class ItemList{

	constructor(){

		this.items = [];
		this.isEmpty = true;
	}
	addItem(item){
		this.items.push(item);	
		this.isEmpty = false;
	}
	removeItem(index=undefined){

		if(index){
			this.items.splice(index,1);
		}
		else{
			this.items.pop();
		
		}
		if(this.items.length < 1) this.isEmpty = true;
	}
	checkIfEmpty(){
		for(let i=0;i<this.items.length;i++){

			if(this.items[i]){
				this.isEmpty = false;
				return;
			}
		}
		this.isEmpty = true;
		return;
	}
}
//*************************************************************************************************
//* @param: root -> parent node, componentHtml -> component (view) Html, childElement -> child container tagname
//* 
class CComponent{

	constructor(root,componentHtml,childElement="div"){

	  if(!root){

	  	console.error("Invalid parent node");
	  	return;
	  }

	  this.root = root;
	  
	  if(!componentHtml){

		console.error("Component view (HTML) is not defined!");
		return;
	  } 

		this.html = componentHtml; // callback that returns html template
		this.counter = 0; // counter
		this.childElement = childElement; // child element that contains the html 
		this.elementHistory = new ItemList();
		this.properties = {};
		this.elementPropertyHistory = new ItemList();
		this.id;

		this.childClass = undefined;
	}

	addClassToChild(classname){

		this.childClass = classname;

		console.log(this.root.children);
	}

	setProperties(properties){
		this.properties = properties;
	}
	// should be called before add method is called
	addProperties(properties){
		
		this.properties = properties;
		
	}
	addElement(tagname,parentElement,content,isContentHtmlElement=false,classname=""){

		let element = document.createElement(tagname);		
		element.classList.add(classname);

		if(!parentElement) parentElement = this.root;

		if(!isContentHtmlElement) parentElement.innerHTML = content;
		else parentElement.appendChild(content);
		return element;

	}
	add(){

		this.id = this.elementHistory.items.length;
		
		this.counter++; // increment counter
		document.dispatchEvent(addComponentEvent);

		if(this.beforeAdd) this.beforeAdd();



		let element = document.createElement(this.childElement); // create child element

		this.elementHistory.addItem(element);
		this.elementHistory.items[this.id].properties = this.properties;
		
		element.innerHTML = this.html(); // set element html

		// add to element history
		// this.elementHistory.items[this.id].properties = this.properties;
		// this.elementPropertyHistory.addItem(this.properties);
		

		if(this.childClass) element.classList.add(this.childClass); // add class to child element

		this.addEventListenerForThis(element);

		this.root.append(element); //*** add element or attach element to the root or parent

		
		if(this.afterAdd) this.afterAdd();
		

	}
	addRemoveBtn(element,classname,componentIndex){
		
		let removeBtn = element.querySelector("."+classname);
		
		removeBtn.addEventListener("click",function(event){
			this.remove(element,removeBtn.attributes[componentIndex].value);
			if(this.onClickRemoveBtn(element,event)) this.onClickRemoveBtn(element,event);
		}.bind(this));
	}

	getLastElement(){
		console.log(this.elementHistory.items);
		return this.elementHistory.items[this.counter-1];
	}
	update(index,properties){
		
		// let keys = Object.keys(properties);

		if(index > this.counter-1){
			
			console.error("Invalid Index !");
	  		return;
		}
		
		let keys = Object.keys(this.elementPropertyHistory.items[index]);
		let property_keys = Object.keys(properties);

		if(keys.length == 0){

			console.error("No property has been initialized!");
	  		return;	
		}

		for(let i=0;i<keys.length;i++){

			if(properties[keys[i]]){
				this.elementPropertyHistory.items[index][keys[i]] = properties[keys[i]];
			}
			
			
			let isNewProperty = false;
			let newProperty='';
			for(let j=0;j<property_keys.length;j++){

				if(keys.indexOf(property_keys[j]) < 0){
				
					newProperty = property_keys[j]
					isNewProperty = true;
					break;
				}
			}

			if(isNewProperty){
				console.error("Unknown property '"+newProperty+"' !");
				break;
			}
		}
		
		this.properties = this.elementPropertyHistory.items[index];
		this.id = index;

		this.elementHistory.items[index].innerHTML = this.html()
		
		this.addEventListenerOnUpdate(this.elementHistory.items[index]);

		if(this.afterUpdate) this.afterUpdate();
		
	}
	remove(element,index=undefined){

		if(!index) this.elementHistory.removeItem();
		else{
			
			this.elementHistory.items[index] = null;	
			this.elementHistory.checkIfEmpty();
		} 
		element.remove();
		this.counter--;
		// console.log(this.elementHistory)
		
	}
	removeParent(){
		this.root.remove();
	}
	addEventListenerOnUpdate(element){}
	addEventListenerForThis(element){}
	afterAdd(){}
	afterUpdate(){}
	beforeAdd(){}

	onClickRemoveBtn(element,event){} // onClickRemoveBtn(element,event)
}

// To assign event
const addComponentEvent = new Event("onaddcomponent");

// To trigger the event Listener
// document.addEventListener("onaddcomponent", () => {
//     console.log("The custom event was triggered")
// });

// To trigger the Event
