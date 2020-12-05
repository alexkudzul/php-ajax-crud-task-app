$(document).ready(function(){
    // console.log("Alex jquery");

    // Se inicializa como false, para poder realizar una condicion si se esta add o edit
    let edit = false;

    // Esconde el div de resultado de la busqueda
    $('#task-result').hide();

    // Se visualiza el contenido de task y description 
    fetchTasks();

    $('#search').keyup(function(){
        if($('#search').val()){
            let search = $('#search').val();
            $.ajax({
                url: 'backend/task-search.php',
                type: 'POST',
                data: {search},
                success: function(response){
                    // console.log(response);
                    let tasks = JSON.parse(response);
                    let template = '';

                    tasks.forEach(task => {
                        template += `
                            <li>
                                ${task.name}
                            </li>                      
                        `;
                    });

                    $('#container').html(template);
                    $('#task-result').show();
                    // console.log(tasks);
                }
            });
        }
    });

    $('#task-form').submit(function(e){
        
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskIdHidden').val()
        }

        // Verifica si esta editando o agregando, se obtiene la url del envio del metodo post
        let url = edit === false ? 'backend/task-add.php' : 'backend/task-edit.php';
        console.log(url);

        // $.post('task-add.php', postData, function(response){
        $.post(url, postData, function(response){
            // console.log(response);           
            fetchTasks();
            $('#task-form').trigger('reset');           
        });
        e.preventDefault();
        
    });

    function fetchTasks(){
        $.ajax({
            url: 'backend/task-list.php',
            type:'GET',
            success : function(response){
                // console.log(response);
    
                let tasks = JSON.parse(response);
    
                let template = '';
    
                tasks.forEach(task => {
                    template += `
                        <tr taskId = "${task.id}">
                            <td>${task.id}</td>
                           <!-- <<td>${task.name}</td> -->
                            <td>
                                <a href="#" class="task-item">${task.name}</a>
                            </td>
                            <td>${task.description}</td>
                            <td>
                                <button class="task-delete btn btn-danger">Delete</button>
                            </td>
                        </tr>                    
                    `;
                });
    
                $('#tasks').html(template);
            }
        });
    }

    $(document).on('click', '.task-delete', function (){
        // console.log("click");

        if(confirm('Are you sure you want to delete')){
            // $(this)[0], obtiene solo el primer elemento seleccionado, con parent sube de nivel hasta llegar al "tr"
            let element = $(this)[0].parentElement.parentElement;
            // Obtiene su atributo taskId
            let id = $(element).attr('taskId');

            $.post('backend/task-delete.php', {id}, function(response){
                // console.log(response);
                fetchTasks();
            });
            console.log(element);
            // console.log(id);
        }
    });

    $(document).on('click', '.task-item', function(){

        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');

        $.post('backend/task-single.php', {id}, function(response){
            console.log(response);

            const task = JSON.parse(response);

            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskIdHidden').val(task.id);

            edit = true;           
        });
    });
});