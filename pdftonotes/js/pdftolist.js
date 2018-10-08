$(function () {
    $('#pageNumberDetection').click();
    var userPDF;
    var badWords=[];
    var pdfjsLib = window['pdfjs-dist/build/pdf'];
    var result_PDF;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
    $('input[type="file"]').change(function (e) {
        var fileName = (e.target.files[0])?e.target.files[0].name:"No file selected";
        $('#filename').text(fileName);
        userPDF = e.target.files[0];
        if (userPDF.type != "application/pdf") {
            console.error(userPDF.name, "is not a pdf file.")
            alert(userPDF.name, "is not a pdf file.");
            return;
        }

        
        console.log('The file "' + fileName + '" has been selected.');
    });
    $('.numDelim').hide();
    $('#btnNumDelim').click(function () {
        if ($('.numDelim').css('display') == 'none') {
            $('.numDelim').show();
        } else {
            $('.numDelim').hide();
        }
    })
    var result;
    $('#btnCopy').click(function () {
        const copyText = document.getElementById("result").textContent;
        const textArea = document.createElement('textarea');
        textArea.textContent = copyText;
        document.body.append(textArea);
        textArea.select();
        document.execCommand("copy");
        $('#btnCopy').text("Copied to clipboard");

        setTimeout(function () {
            $('#btnCopy').text("Copy to clipboard");
        }, 2000);
    });
    $('#btnConvert').click(function () {
        var finalText="";
        var fileReader = new FileReader();
        var pageStart=parseInt($('#pageStart').val());
        var pageEnd=parseInt($('#pageEnd').val());
        var excludeStart=parseInt($('#excludeStart').val());
        var excludeEnd=parseInt($('#excludeEnd').val());
        badWords=$('#badWords').val().split(',');
        fileReader.onload = function () {
            var typedarray = new Uint8Array(this.result);

            // var pdfjs = pdfjsLib.getDocument(typedarray)
            pdfjsLib.getDocument(typedarray).then(function (pdf) {
                // you can now use *pdf* here
                if(isNaN(pageEnd)||pageEnd==0)pageEnd=pdf.numPages;
                if(isNaN(pageStart)||pageStart==0)pageStart=1;
                if(isNaN(excludeEnd))excludeEnd=0;
                if(isNaN(excludeStart))excludeStart=0;
                var count=pageStart;
                for(var i=pageStart;i<=pageEnd;i++){
                    pdf.getPage(i).then(function (page) {
                        // you can now use *page* here
                        page.getTextContent().then(function(textContent){
                            finalText+='\n'
                            for(var j=excludeStart;j<textContent.items.length-excludeEnd;j++){
                                var detectNumber=textContent.items[j].str.replace(/ /g,"");
                                var parsedInt=parseInt(detectNumber);
                                if($('#pageNumberDetection').is(':checked')&&!isNaN(parsedInt)&&detectNumber.length<3){
                                    continue;
                                }else{
                                    var textItem=textContent.items[j].str;
                                    var remove=false;
                                    for(var k=0;k<badWords.length;k++){
                                        if(textItem.indexOf(badWords[k])!=-1&&badWords[k].length>=textItem.length/2){
                                            remove=true;
                                            break;
                                        }
                                    }
                                    if(remove){
                                        continue;
                                    }else{
                                        finalText+=textItem;
                                    }
                                }

                            }
                            if(count==pageEnd){
                                convertFromPDF(finalText);
                            }
                            count++;
                            // console.log(finalText);
                        })
                        
                    });
                }
                
            });
        };
        
        fileReader.readAsArrayBuffer(userPDF);
        // console.log(userText);
        // userText=convertText(userText);
        
        // result = userText;
        // console.log(userText);

    });
    function convertFromPDF(text){
        result_PDF=convertText(text);
        $('#result').text(result_PDF);
    }
    function convertText(userText){
        console.log(userText);
        var split1 = $('#splitter1').val();
        var split2 = $('#splitter2').val();
        var split3 = $('#splitter3').val();
        var numDelim = $('#numDelim').val();
        if (split1 == "NUM") {
            if (split2 == "NUM" || split3 == "NUM") {
                alert("Only use one splitter for Numbered input");
                return;
            }
        } else if (split2 == "NUM" && split3 == "NUM") {
            alert("Only use one splitter for Numbered input");
            return;
        }
        var splitterCount = 0;
        if (split3 != "") {
            splitterCount = 3;
        } else if (split2 != "") {
            splitterCount = 2;
        }else if(split1!=""){
            splitterCount=1;
        }
        while (splitterCount > 2 && split3 != "NUM" && userText.indexOf(split3) != -1) {
            userText = userText.replace(split3, "\n\t\t\t");
        }
        var keepReplacing = true;
        while (splitterCount > 2 && split3 == "NUM" && keepReplacing) {
            keepReplacing = false;
            for (var i = 100; i > 0; i--) {
                if (userText.indexOf(i + numDelim) != -1) keepReplacing = true;
                userText = userText.replace(i + numDelim, "\n\t\t\t");
            }
        }
        keepReplacing = true;
        while (splitterCount > 1 && userText.indexOf(split2) != -1) {
            userText = userText.replace(split2, "\n\t\t");
        }
        while (splitterCount > 1 && split2 == "NUM" && keepReplacing) {
            keepReplacing = false;
            for (var i = 100; i > 0; i--) {
                if (userText.indexOf(i + numDelim) != -1) keepReplacing = true;
                userText = userText.replace(i + numDelim, "\n\t\t");
            }
        }
        keepReplacing = true;
        while (splitterCount > 0 && userText.indexOf(split1) != -1) {
            userText = userText.replace(split1, "\n\t");
        }
        while (splitterCount > 0 && split1 == "NUM" && keepReplacing) {
            keepReplacing = false;
            for (var i = 100; i > 0; i--) {
                if (userText.indexOf(i + numDelim) != -1) keepReplacing = true;
                userText = userText.replace(i + numDelim, "\n\t");
            }
        }
        return userText;
    }
})