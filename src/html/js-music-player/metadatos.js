const jsmediatags = window.jsmediatags;

document.querySelector("#input").addEventListener("change", (event) => {
  
  const file = event.target.files[0];
  console.log(file);
  jsmediatags.read(file, {
    onSuccess: function(tag) { 

      // Array buffer to base64
      const data = tag.tags.picture.data;
      const format = tag.tags.picture.format;
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }

      // Output media tags
      document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
      
      document.querySelector("#title").textContent = tag.tags.title;
      document.querySelector("#artist").textContent = tag.tags.artist;
      document.querySelector("#album").textContent = tag.tags.album;
      document.querySelector("#genre").textContent = tag.tags.genre;
      },
      onError: function(error) {
        console.log(error);
      }
  });  
});
