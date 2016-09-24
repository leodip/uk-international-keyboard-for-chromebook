// UK International keyboard layout

var context_id = -1;
var previousCode = "";
var shiftedRight = false;
var shiftedLeft = false;
var map =
  {
    "Quote_c": "ç",
    "Quote_a": "á",
    "Quote_e": "é",
    "Quote_u": "ú",
    "Quote_i": "í",
    "Quote_y": "ý",
    "Quote_o": "ó",
    "Quote_C": "Ç",
    "Quote_A": "Á",
    "Quote_E": "É",
    "Quote_U": "Ú",
    "Quote_I": "Í",
    "Quote_Y": "Ý",
    "Quote_O": "Ó",
    "Quote_ ": "'",
    "Backquote_a": "à",
    "Backquote_e": "è",
    "Backquote_u": "ù",
    "Backquote_i": "ì",
    "Backquote_o": "ò",
    "Backquote_A": "À",
    "Backquote_E": "È",
    "Backquote_U": "Ù",
    "Backquote_I": "Ì",
    "Backquote_O": "Ò",
    "Backquote_ ": "`",
    "Digit2_a" : "ä",
    "Digit2_e" : "ë",
    "Digit2_u" : "ü",
    "Digit2_i" : "ï",
    "Digit2_y" : "ÿ",
    "Digit2_o" : "ö",
    "Digit2_A" : "Ä",
    "Digit2_E" : "Ë",
    "Digit2_U" : "Ü",
    "Digit2_I" : "Ï",
    "Digit2_O" : "Ö",
    "Digit2_ " : "\"",
    "Digit6_a" : "â",
    "Digit6_e" : "ê",
    "Digit6_u" : "û",
    "Digit6_i" : "î",
    "Digit6_o" : "ô",
    "Digit6_A" : "Â",
    "Digit6_E" : "Ê",
    "Digit6_U" : "Û",
    "Digit6_I" : "Î",
    "Digit6_O" : "Ô",
    "Digit6_ " : "^",
    "Backslash_a": "ã",
    "Backslash_n": "ñ",
    "Backslash_o": "õ",
    "Backslash_N": "Ñ",
    "Backslash_A": "Ã",
    "Backslash_O": "Õ",
    "Backslash_ ": "~"
  };

chrome.input.ime.onFocus.addListener(function(context)
{
  context_id = context.contextID;
});

function isPureModifier(keyData)
{
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

chrome.input.ime.onKeyEvent.addListener(
  function(engineID, keyData){
    
    var handled = false;
    
    if(previousCode !== "" && keyData.type == "keydown" && !isPureModifier(keyData))
    {
      var mapValue = map[previousCode + "_" + keyData.key];
      if(mapValue)
      {
        chrome.input.ime.commitText({"contextID": context_id, "text": mapValue});
        handled = true;
      }
      else
      {
        if(previousCode == "Quote") { chrome.input.ime.commitText({"contextID": context_id, "text": "'"}); }
        else if(previousCode == "Backquote") { chrome.input.ime.commitText({"contextID": context_id, "text": "`"}); }
        else if(previousCode == "Backslash") { chrome.input.ime.commitText({"contextID": context_id, "text": "~"}); }
        else if(previousCode == "Digit2") { chrome.input.ime.commitText({"contextID": context_id, "text": "\""}); }
        else if(previousCode == "Digit6") { chrome.input.ime.commitText({"contextID": context_id, "text": "^"}); }
      }
      previousCode = "";
    }
    
    if(!handled && keyData.type == "keydown")
    {
      if(keyData.code == "Quote" || keyData.code == "Backquote")
      {
        previousCode = keyData.code;
        handled = true;
      }
      else if(keyData.code == "ShiftRight")
      {
        shiftedRight = true;
      }
      else if(keyData.code == "ShiftLeft")
      {
        shiftedLeft = true;
      }
      else if((shiftedRight || shiftedLeft) && (keyData.code == "Backslash" || keyData.code == "Digit2" || keyData.code == "Digit6"))
      {
        previousCode = keyData.code;
        handled = true;
      }
    }
    
    if(!handled && keyData.type == "keyup")
    {
      if(keyData.code == "ShiftRight" && shiftedRight)
      {
        shiftedRight = false;
      }
      else if(keyData.code == "ShiftLeft" && shiftedLeft)
      {
        shiftedLeft = false;
      }
    }
    
    return handled;
  }
);
