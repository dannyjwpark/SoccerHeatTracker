const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';
let req = new XMLHttpRequest();

document.getElementById('passData').addEventListener('click', dataTable);

function selectMode(){
    const matchModes = document.querySelector('dropdown-content');
    let selectedMode = matchModes.options[matchModes.selectedIndex].value;
    alert(selectedMode);
    return(selectedMode);
    
}
console.log(selectMode());

function dataTable(){
    fetch(dataURL).then(
        res=> {
            res.json().then(
                data=>{
                    // adjusting 2nd half minutes
                    data.forEach((el) => {
                        if (el.period === 2){
                            el.minute += 45;
                        }
                    })

                    if(data.length > 0){
                        let temp= "";

                        // -- star for loop
                        data.forEach((el) => {
                            if (el.type["name"] === "Pass"){
                                temp += "<tr>";
                                temp += "<td>" + el.period + "</td>";
                                temp += "<td>" + el.timestamp.slice(0,5) + "</td>";
                                temp += "<td>" + el.team.name + "</td>";
                                temp += "<td>" + el.player.name + "</td>";
                                temp += "<td>" + el.type.name + "</td>";
                                temp += "<td>" + el.pass.recipient + "</td>";
                                temp += "<td>" + el.location + "</td>";
                                temp += "<td>" + el.pass.end_location + "</td>";
                                temp += "<td>" + el.pass.length + "</td>";
                                temp += "<td>" + el.pass.angle + "</td></tr>";
                            }
                        })
                        // --close for loop

                        let tablePos = document.getElementById("data");
                        tablePos.insertAdjacentHTML('afterend',temp);                    
                    }
                }
            ).catch(error => {
                throw Error("ERROR: no data found");
            })
        }
    )
}


// dropdown
$(document).ready(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
});



// field

