// storage Controller

const StorageCtrl = function(){
    return {
     storeItem: function(item){
         let items;
         // check if there is something in local stroage
         if(localStorage.getItem('items') === null){
             items = [];
             items.push(item);
             localStorage.setItem('items',JSON.stringify(items));
         }else{
             items = JSON.parse(localStorage.getItem('items'));
             items.push(item);
             localStorage.setItem('items',JSON.stringify(items));
         }
     },
     getItemsFromStorage: function(){
         let items;
         if(localStorage.getItem('items')===null){
             items = [];
         }else{
             items = JSON.parse(localStorage.getItem('items'))
         }
         return items;
     },
     updateItemInStorage: function(updatedItem){
       let items;
       items = JSON.parse(localStorage.getItem('items'));
       items.forEach((item,index)=>{
           if (item.id === updatedItem.id) {
               items.splice(index,1,updatedItem);
           }
       })
       localStorage.setItem('items',JSON.stringify(items));
     }, 
     deleteItemFromStorage: function(id){
       let items;
       items = JSON.parse(localStorage.getItem('items'));
       items.forEach((item,index)=>{
           if (item.id === id) {
               items.splice(index,1);
           }
       })
       localStorage.setItem('items',JSON.stringify(items));
     },
     clearAllFromStorage: function(){
         localStorage.removeItem('items');
     } 

    }

}()

// Item Controller

const ItemCtrl = function () {

    // Item Constructor
    const Item = function (id, name, calories, timeStamp) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.timeStamp = timeStamp
    }

    // Define Data Structure
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    return {
        // Add meal Function
        addMeal: function (meal, calories) {

            //get Date and Time
            let timeStamp = new Date().toLocaleString();

            // making id for meals
            let id;
            if (data.items.length > 0) {

                id = (data.items[data.items.length - 1].id + 1);

            } else {
                id = 0;
            }
            //init a new item Constructor
            newItem = new Item(id, meal, parseInt(calories), timeStamp);
            //pushing into array
            data.items.push(newItem);

            return newItem;

        },
        // update item 
        updateItem: function(updatedMeal,updatedCalories){
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    item.name = updatedMeal;
                   item.calories = parseInt(updatedCalories);
                   found = item; 
                }                
            })
            return found;
        },
        // get Total Calories 
        getTotalCalorie: function () {
            let totalCalories = 0;
            data.items.forEach((item) => {
                totalCalories += item.calories;
            })
            data.totalCalories = totalCalories;
            return data.totalCalories;
        },
        // set Current Item 
        setCurrentItem: function(id){
            let currentMeal;
            this.getItems().forEach((item)=>{
                if(item.id === id){
                    currentMeal = item;
                }
            })
            data.currentItem = currentMeal;
        },
        // remove item
        removeItem: function(id){
            const idArr = data.items.map((item)=>{
                return item.id;
            })
            const item = idArr.indexOf(id);
            data.items.splice(item,1);

        },
        //clear all items
        clearAllItems: function(){
            data.items = [];
        },
        //get Current Item
        getCurrentItem: function(){
            return data.currentItem;
        },
        // get Data Function
        getData: function () {
            return data;
        },
        getItems: function () {
            return data.items;
        },
    }

}()

// UI Controller

const UICtrl = function () {

    // Ui Selectors
    const uiSelectors = {
        itemList: '#item-list',
        addBtn: '#add-btn',
        mealInput: '#add-meal',
        caloriesInput: '#add-calories',
        totalCalories: '#total-calories',
        updateBtn: '#update-btn',
        deleteBtn: '#delete-btn',
        backBtn: '#back-btn',
        clrBtn: '#clear-btn',
        listItems : '.collection-item'

    }


    return {
        getUiSelectors: function () {
            return uiSelectors;
        },

        // make list items from cureent data
        makeList: function (items) {

            let output = '';
            items.forEach(item => {
                output += `<li class="collection-item" id="item-${item.id}"><strong>${item.name} :</strong> <em> ${item.calories} Kacl</em><span class="timestamp">${item.timeStamp}</span>
              <a href="#" class="secondary-content"><i class="fas fa-edit white-text edit-item"></i></a>
            </li>`
            });
            document.querySelector(uiSelectors.itemList).innerHTML = output;
        },

        // add new data to the list
        addListItem: function (item) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name} :</strong> <em> ${item.calories} Kacl</em><span class="timestamp">${item.timeStamp}</span>
            <a href="#" class="secondary-content"><i class="fas fa-edit white-text edit-item"></i></a>`
            document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        // update list in ui
        updateList: function(updatedItem){
            const listNodes = document.querySelectorAll(uiSelectors.listItems);
            const listArr = Array.from(listNodes);
            listArr.forEach((item)=>{
                const idArr = item.getAttribute('id');
                if (idArr === `item-${updatedItem.id}`) {
                    document.querySelector(`#${idArr}`).innerHTML = `<strong>${updatedItem.name} :</strong> <em> ${updatedItem.calories} Kacl</em>
                    <a href="#" class="secondary-content"><i class="fas fa-edit white-text edit-item"></i></a>`
                }
            })

        },
        //display total calories
        showCalories: function (totalCalories) {
            document.querySelector(uiSelectors.totalCalories).innerText = totalCalories;

        },

        // clear input fields 
        clearInput: function () {
            document.querySelector(uiSelectors.mealInput).value = '';
            document.querySelector(uiSelectors.caloriesInput).value = '';

        },
        // Display Edit State
        displayEditState: function(item){
            //filling input fields
            document.querySelector(uiSelectors.mealInput).value = item.name;
            document.querySelector(uiSelectors.caloriesInput).value = item.calories;

            //display buttons
            document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
            document.querySelector(uiSelectors.backBtn).style.display = 'inline';
            document.querySelector(uiSelectors.addBtn).style.display = 'none';
        },
        // clear Edit State
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(uiSelectors.updateBtn).style.display = 'none';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
            document.querySelector(uiSelectors.backBtn).style.display = 'none';
            document.querySelector(uiSelectors.addBtn).style.display = 'inline';

        },
        // remove list item
        removeListItem: function(id){
            const itemId = `item-${id}`;
            document.getElementById(itemId).remove();
        },

        // clear all list items
        clearAllListItems: function(){
            const listNodes = document.querySelectorAll(uiSelectors.listItems);
            const listArr = Array.from(listNodes);
            listArr.forEach((item)=>{
                item.remove();
            })
        }
    }

}()

// App Controller

const AppCtrl = function (ItemCtrl, StorageCtrl, UICtrl) {
    //Event Listeners Function
    function loadEventListeners() {
        // Add meal button
        document.querySelector(UICtrl.getUiSelectors().addBtn).addEventListener('click', addItems);

        // Enable Edit State
        document.querySelector(UICtrl.getUiSelectors().itemList).addEventListener('click',enableEditState);

        // Update Item on edit
        document.querySelector(UICtrl.getUiSelectors().updateBtn).addEventListener('click',updateItemSubmit);

        // back delete event
        document.querySelector(UICtrl.getUiSelectors().deleteBtn).addEventListener('click',deleteItem);

        // clear button event
        document.querySelector(UICtrl.getUiSelectors().clrBtn).addEventListener('click',clearAll) 

        // back button event
        document.querySelector(UICtrl.getUiSelectors().backBtn).addEventListener('click',UICtrl.clearEditState);

    }

    // Add Items Function
    function addItems(e) {
        const meal = document.querySelector(UICtrl.getUiSelectors().mealInput);
        const calories = document.querySelector(UICtrl.getUiSelectors().caloriesInput);

        // ADD ITEMS 
        if (meal.value !== '' && calories.value !== '') {
            const newItem = ItemCtrl.addMeal(meal.value, calories.value);

            // add this item into ui
            UICtrl.addListItem(newItem);
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalorie();
            // show calories in ui
            UICtrl.showCalories(totalCalories);
            // store item in Local Storage
            StorageCtrl.storeItem(newItem);
            // clear input fields
            UICtrl.clearInput();
        }


        e.preventDefault();
    }

    //Enable Edit State
    const enableEditState = function(e){

        if (e.target.classList.contains('edit-item')) {
            const idString = e.target.parentNode.parentNode.id;
            const idArr = idString.split('-');
            const id = parseInt(idArr[1]);
            ItemCtrl.setCurrentItem(id);
            const currentItem = ItemCtrl.getCurrentItem();
            UICtrl.displayEditState(currentItem);
        }
        e.preventDefault();
    }

    // Update Item Submit
    const updateItemSubmit = function(){
        //getting updated input
        const updatedMeal = document.querySelector(UICtrl.getUiSelectors().mealInput);
        const updatedCalories = document.querySelector(UICtrl.getUiSelectors().caloriesInput);

        //updating item in data Structure
        const updatedItem = ItemCtrl.updateItem(updatedMeal.value,updatedCalories.value);

        // Updating in the ui
        UICtrl.updateList(updatedItem);

        // Update in Local Storage
        StorageCtrl.updateItemInStorage(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalorie();
         // show calories in ui
         UICtrl.showCalories(totalCalories);
         // clear edit State
         UICtrl.clearEditState();

    }

    // Delete Items

    const deleteItem = function(e){
        const id = ItemCtrl.getCurrentItem().id;
        // delete item from data structure
        ItemCtrl.removeItem(id);
        //delete item from local Storage
        StorageCtrl.deleteItemFromStorage(id);
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalorie();
         // show calories in ui
         UICtrl.showCalories(totalCalories);
         // clear edit State
         UICtrl.clearEditState();
        //delete item from UI
        UICtrl.removeListItem(id);
        

        e.preventDefault();
    }

    // Clear all
    const clearAll = function(e){
      //clear all items from Data Structure
      ItemCtrl.clearAllItems();
      //clear all items from Ui
      UICtrl.clearAllListItems();
      //clear all items from local Storage
      StorageCtrl.clearAllFromStorage();
       // get total calories
       const totalCalories = ItemCtrl.getTotalCalorie();
       // show calories in ui
       UICtrl.showCalories(totalCalories);
       // clear edit State
       UICtrl.clearEditState();
        e.preventDefault();
    } 

    return {
        init: function () {
            // clear Edit State
            UICtrl.clearEditState();

            //fetching from data Structure
            const items = ItemCtrl.getItems();
            //passing list in UI method
            UICtrl.makeList(items);
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalorie();
            // show calories in ui
            UICtrl.showCalories(totalCalories);

            //init load event listeners
            loadEventListeners()

        }
    }

}(ItemCtrl,StorageCtrl, UICtrl)

AppCtrl.init();