const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const wordTitle = document.getElementById('word-title');
const pronounceButton = document.getElementById('pronounce-button');
const meaningContainer = document.getElementById('meaning-container');
const imageSection = document.getElementById('image-section');
const errorMessage = document.getElementById('error-message');

let audio = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = searchInput.value.trim();
  if (!word) return;

  results.style.display = 'none';
  errorMessage.style.display = 'none';
  loading.style.display = 'block';
  imageSection.style.display = 'none';

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    loading.style.display = 'none';

    if (data.title === "No Definitions Found") {
      errorMessage.style.display = 'block';
      return;
    }

    results.style.display = 'block';
    wordTitle.textContent = data[0].word;

    // Set pronunciation audio
    const phonetics = data[0].phonetics.find(p => p.audio);
    if (phonetics && phonetics.audio) {
      audio = new Audio(phonetics.audio);
      pronounceButton.style.display = 'inline-block';
    } else {
      pronounceButton.style.display = 'none';
    }

    meaningContainer.innerHTML = "";

    data[0].meanings.forEach(meaning => {
      const div = document.createElement('div');
      div.classList.add('part-of-speech');
      div.innerHTML = `
        <h3>${meaning.partOfSpeech}</h3>
        <p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>
        <p><strong>Example:</strong> ${meaning.definitions[0].example || 'No example available.'}</p>
        <p><strong>Synonyms:</strong> ${meaning.synonyms.length ? meaning.synonyms.join(', ') : 'None'}</p>
        <p><strong>Antonyms:</strong> ${meaning.antonyms.length ? meaning.antonyms.join(', ') : 'None'}</p>
      `;
      meaningContainer.appendChild(div);
    });

  } catch (error) {
    loading.style.display = 'none';
    errorMessage.style.display = 'block';
    console.error('Error fetching word:', error);
  }
});

pronounceButton.addEventListener('click', () => {
  if (audio) {
    audio.play();
  }
});
