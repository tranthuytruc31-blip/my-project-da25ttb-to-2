/*Viết mã Javascript*/
function printBCC(n)
{
    let result = "";

    let i = 1;
    while(i<=10)
    {
        result += `${n} x ${i} = ${n*i} <br>`; 
        i++;
    }
    //Đưa kết quả vào thẻ div có id là "result"
    document.getElementById("result").innerHTML = result;
}