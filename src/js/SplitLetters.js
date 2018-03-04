export default function SplitLetters(selector, wrapper = "$", delimiter = "", joiner = "") {
  let nodeList = document.querySelectorAll(selector);

  function parseLetters(node)
  {
    let htmlNode = node.cloneNode();
    htmlNode.innerHTML = "";

    for (let i = 0; i < node.childNodes.length; i++)
    {
      let childNode = node.childNodes[i];
      if (childNode.nodeType === Node.TEXT_NODE)
      {
        htmlNode.innerHTML += childNode.data
          .split(delimiter)
          .map(function (letter) {
            let result = "";

            if (letter.trim().length === 0)
            {
              result = letter;
            }
            else
            {
              result = wrapper.replace(/\$/g, letter);
            }

            return result;
          })
          .join(joiner);
      }
      else
      {
        htmlNode.appendChild(parseLetters(childNode));
      }
    }

    return htmlNode;
  }

  for (let i = 0; i < nodeList.length; i++)
  {
    nodeList[i].innerHTML = parseLetters(nodeList[i]).innerHTML;
  }
}