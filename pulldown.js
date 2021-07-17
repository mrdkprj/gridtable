"use strict"

export default class Pulldown{

    constructor(){

        this.width = "150px";
        this.selectionHeight = 30;
        this.optionHeight = 27;
        this.padding = 2;

        this.pulldown = document.createElement("div");
        this.pulldown.classList.add("pulldown");

        this.holder = document.createElement("div");
        this.holder.classList.add("holder");
        this.pulldown.appendChild(this.holder);

        this.selection = document.createElement("div");
        this.selection.classList.add("selection");

        const selectArea = document.createElement("div");
        selectArea.classList.add("select-area");
        this.selectButton = document.createElement("span");
        this.selectButton.classList.add("pulldown-btn");
        this.selectButton.addEventListener("mousedown", this.togglePulldown.bind(this));
        selectArea.appendChild(this.selectButton);

        this.pulldownArea = document.createElement("div");
        this.pulldownArea.classList.add("pulldown-area");

        const searchArea = document.createElement("div");
        searchArea.classList.add("search-text-area");
        const textSpan = document.createElement("span");
        this.textInput = document.createElement("input");
        this.textInput.type = "text";
        this.textInput.classList.add("search-text");
        this.textInput.addEventListener("keyup", this.filter.bind(this));
        this.textInput.addEventListener("blur", this.onFocusOut.bind(this));
        textSpan.appendChild(this.textInput);
        const xMark = document.createElement("div");
        xMark.classList.add("clear-text");
        xMark.innerHTML = "&#10006;";
        xMark.addEventListener("mousedown", this.clearFilter.bind(this));
        textSpan.appendChild(xMark);
        searchArea.appendChild(textSpan);

        this.optionArea = document.createElement("ul");
        this.optionArea.classList.add("options");

        this.pulldownArea.appendChild(searchArea);
        this.pulldownArea.appendChild(this.optionArea);

        this.selection.appendChild(selectArea);
        this.selection.appendChild(this.pulldownArea);

        this.pulldown.appendChild(this.selection);

        this.data = [];
        this._data = [];
        this.value = null;
        this.filtered = false;

    }

    create(data){

        console.log(this.holder.offsetWidth)
        this._init(data);
        console.log(this.holder.offsetWidth)
        this.addOptions();
        console.log(this.holder.offsetWidth)
        this.holder.textContent = this.holderText;
        console.log(this.holder.offsetWidth)
        this.optionArea.style["min-width"] = this.holder.offsetWidth + "px";

        return this.pulldown;
    }

    _init(data){
        this.current = null;
        this.value = null;
        this.closePulldown();

        this._prepareData(data);

        this.filtered = false;
        this.optionArea.innerHTML = "";
        this.holder.textContent = "";
        this.selectButton.textContent = "";
    }

    _prepareData(data){
        this.data = {};
        this._data = {};

        let key, value;
        if(Array.isArray(data)){
            data.forEach((entry) => {
                if(typeof entry === "object"){
                    Object.entries(entry).forEach(([k, v]) => {
                        key = this.toStringNullSafe(k);
                        value = this.toStringNullSafe(v);
                    })
                }else{
                    key = this.toStringNullSafe(entry);
                    value = key;
                }
                this.data[key] = value;
                this._data[key] = value;
            });
        }else{
            this.data = [];
            this._data = [];
        }

    }

    addOptions(){
        const options = document.createDocumentFragment();

        let maxLen = 0;
        this.holderText = null;

        Object.entries(this.data).forEach(([value, label]) => {
            const option = document.createElement("li");
            const text = document.createElement("a");
            text.addEventListener("mousedown", this.onItemClick.bind(this));
            text.classList.add("option");
            text.textContent = label;
            text.setAttribute("data-value", value);
            option.appendChild(text);
            options.appendChild(option);

            if(label.length >= maxLen){
                maxLen = label.length;
                this.holderText = label;
            }

            if(this.value == value){
                this.setCurrent(text)
            }
        })

        this.optionArea.appendChild(options);

    }

    togglePulldown(e){

        e.preventDefault();

        if(Object.keys(this.data).length <= 0){
            this.closePulldown();
            return;
        }

        if(this.isOpened()){
            this.closePulldown();
        }else{
            this.openPulldown();
        }
    }

    isOpened(){
        return this.selection.classList.contains("open");
    }

    openPulldown(){
        this.selection.classList.add("open");

        if(this.current){
            this.optionArea.scrollTop = this.current.node.offsetTop - this.optionHeight;
        }
        this.textInput.focus();
    }

    closePulldown(){
        this.selection.classList.remove("open");
    }

    onItemClick(e){
        if(e.button == 2){
            e.preventDefault();
            return;
        }

        this.clearCurrent();

        e.target.classList.add("selected");
        this.setCurrent(e.target);
        this.value = e.target.getAttribute("data-value");
        this.selectButton.textContent = this.value;
        this.closePulldown();
    }

    setCurrent(target){
        this.current = {node: target, top: target.getBoundingClientRect().top};
        target.classList.add("selected");
    }

    clearCurrent(){
        if(this.current){
            this.current.node.classList.remove("selected");
         }
    }

    filter(e){

        if(e.isComposing) return;

        if(e.target.value == "" || e.target.value == null){
            this.clearFilter();
            return;
        }

        const value = this.toStringNullSafe(e.target.value).toUpperCase();

        this.filtered = true;

        this.optionArea.innerHTML = "";

        this.data = Object.fromEntries(Object.entries(this._data).filter(([k,v]) =>{
            return v.toUpperCase().includes(value);
        }))

        this.addOptions();
    }

    clearFilter(e){

        if(e){
            e.preventDefault();
        }

        if(this.filtered == false){
            return;
        }

        this.textInput.focus();
        this.optionArea.innerHTML = "";
        this.textInput.value = "";
        this.data = this._data;
        this.addOptions();
        this.filtered = false;
    }

    onFocusOut(e){
        if(this.isOpened()){
            this.closePulldown();
        }
    }

    toStringNullSafe(value){

		if(value == null){
			return "";
		}

		return value.toString();

	}

}
