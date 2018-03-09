var App = (function () {
    var _notes = [];
    var _completed = [];

    function _render(element, list, cb) {
        document.getElementById(element).innerHTML = '';
        for (var i = 0; i < list.length; i++) {
            if(list[i]){
                element == "sortable" ? _appendNote(list[i], i) : _appendNoteCompleted(list[i], i); 
            }
        }    
        if(typeof cb === "function"){
            cb('READY');
        }
    }

    function _appendNote(note, length) {
        var li = document.createElement("li");
        li.innerHTML= '<div class="checkbox" >\
                            <label>\
                                <input type="checkbox" class="chk" value="'+ length +'"" />'+ note +'</label>\
                        </div>';
        document.getElementById("sortable").appendChild(li);
        document.getElementById("todoinput").value = '';
        document.getElementById("counter").innerHTML = _notes.length;
    }

    function _appendNoteCompleted(note, length) {
        var comp_li = document.createElement("li");
        comp_li.innerHTML= note + ' <button completed_id="'+ length +'" class="remove-item btn btn-default btn-xs pull-right"><span completed_id="'+ length +'" class="glyphicon glyphicon-remove"></span></button>';
        document.getElementById("done-items").appendChild(comp_li);
    }

    function init(notes) {
        _notes = notes || [];
        _render("sortable" , _notes); 
    }
    
    function addTODO(note) {
        _notes.push(note);
        var id = _notes.length-1;
        _appendNote(note, id);
    }

    function movetoCompleted(note_id) {
        _completed.push(_notes[note_id]);
        var complete_note_name = _notes[note_id];
        delete _notes[note_id];    
        var id = _completed.length-1;
        _appendNoteCompleted(complete_note_name, id);
        _render("sortable", _notes);
    }

    function setCounter(){
        _clean(_notes, function(){
            document.getElementById("counter").innerHTML = _notes.length;
        });
    }

    function _clean(list, cb) {
        for (var i = 0; i < list.length; i++) {
            if (typeof list[i] === "undefined") {         
                list.splice(i, 1);
                i--;
            }
        }
        if(typeof cb === "function"){
            cb(true);
        }
    }

    function remove(id) {
        delete _completed[id];
        _render("done-items", _completed);        
    }

    function removeAll() {        
        _notes.forEach(function(val, key){
            movetoCompleted(key);
        });
        setCounter();
    }

    return {
        setCounter: setCounter,
        Render: _render,
        addTODO: addTODO,
        init: init,
        movetoCompleted: movetoCompleted,
        remove: remove,
        removeAll: removeAll
    }
})();
    

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        App.init(['todo #1', 'todo #2', 'todo #3', 'todo #4']);

        document.getElementById('sortable').addEventListener('click', function(event) {
            var checked = event.target.checked;
            if(checked) {
                var id = event.target.value;
                App.movetoCompleted(id);
                App.setCounter();
            }
        });

        document.getElementById('done-items').addEventListener('click', function(event) {
            if(event.target.nodeName == "BUTTON" || event.target.nodeName == "SPAN") {
                var id = event.target.getAttribute('completed_id');
                App.remove(id);
            }
        });

        document.getElementById('todoinput').addEventListener('keydown', function(event) {
            if (event.which === 13) {
                if(event.target.value && event.target.value.length){
                    App.addTODO(event.target.value);
                }
            }
        });

        document.getElementById('checkAll').addEventListener('click', function(event) {
            App.removeAll();
        });

    }
}