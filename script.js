// Carousel
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.carousel-img');
  let index = 0;
  setInterval(() => {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
  }, 3000);

  // WhatsApp phone links
  const phoneLinks = document.querySelectorAll('.phone-link');
  phoneLinks.forEach(el => {
    el.addEventListener('click', () => {
      const phone = el.getAttribute('data-phone');
      const cleanNumber = phone.replace(/\D/g, '');
      const whatsappURL = `https://wa.me/${cleanNumber}`;
      window.open(whatsappURL, '_blank');
    });
  });

  // Load language settings
  loadLanguage();

  // Load slider books
  fetch('https://script.google.com/macros/s/AKfycbwHPs0wkrEanrLqk7hbTfn6Y_Ag61UUJXO045iXtth7KDKuWp8w6t7p6y4ScqC1L8EUYA/exec')
    .then(res => res.json())
    .then(data => {
      const slider = document.getElementById("bookSlider");
      slider.innerHTML = '';

      data.forEach(book => {
        const card = createBookCard(book);
        slider.appendChild(card);
      });

      // Duplicate cards for infinite scroll effect
      data.forEach(book => {
        const card = createBookCard(book);
        card.classList.add("clone");
        slider.appendChild(card);
      });

      startInfiniteScroll(slider);
    })
    .catch(err => console.error("Error loading books:", err));
});

// Infinite scroll function
function startInfiniteScroll(container) {
  let scrollSpeed = 1;
  function autoScroll() {
    container.scrollLeft += scrollSpeed;
    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollLeft = 0;
    }
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);
}

// Create book card for slider
function createBookCard(book) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.innerHTML = `
    <img src="${book.image}" alt="${book.title}" />
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p class="description">${book.description}</p>
  `;
  return card;
}

// Local PDF storage
let customPDFs = [];
fetch("bookPDFs.json")
  .then(res => res.json())
  .then(data => {
    customPDFs = data;
  })
  .catch(err => {
    console.error("Error loading local JSON:", err);
  });

// Book search with only local PDF links
function searchBooks() {
  const query = document.getElementById("bookInput").value.trim();
  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = "Searching...";

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = "";

      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "No books found.";
        return;
      }

      data.items.slice(0, 4).forEach(book => {
        const info = book.volumeInfo;

        const title = info.title || "No title";
        const authors = info.authors ? info.authors.join(", ") : "Unknown author";
        const description = info.description ? info.description.substring(0, 200) + "..." : "No description available.";
        const thumbnail = info.imageLinks?.thumbnail || "";

        const localMatch = customPDFs.find(b => b.title.toLowerCase() === title.toLowerCase());
        const localPDF = localMatch ? localMatch.link : null;
        const localCover = localMatch ? localMatch.cover : "";

        const finalThumbnail = thumbnail || localCover;

        const bookHTML = `
          <div style="
            flex: 0 1 320px;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            background: #f9f9f9;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            gap: 15px;
            align-items: flex-start;
            margin-bottom: 20px;
          ">
            <img src="${finalThumbnail}" alt="Book Cover" style="height: 140px; width: 100px; object-fit: cover; border-radius: 5px;" />
            <div style="flex-grow: 1;">
              <h2 style="margin: 0 0 10px; font-size: 1.2rem;">${title}</h2>
              <p style="margin: 0 0 6px;"><strong>Author:</strong> ${authors}</p>
              <p style="font-size: 0.9rem; color: #444;">${description}</p>
              ${
                localPDF
                  ? `<a href="${localPDF}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 600;">📄 View PDF / Read Online</a>`
                  : `<p style='color: grey; margin-top: 8px;'>No PDF available. Try another book.</p>`
              }
            </div>
          </div>
        `;
        resultsDiv.innerHTML += bookHTML;
      });
    })
    .catch(error => {
      resultsDiv.innerHTML = "An error occurred while searching.";
      console.error("Fetch error:", error);
    });
}

// Smooth scroll to library section
function scrollToLibrary() {
  const librarySection = document.querySelector("#our-library");
  if (librarySection) {
    librarySection.scrollIntoView({ behavior: "smooth" });
  }
}


const translations = {
  en: {
    home: "Home",
    myBooks: "My Books",
    title: "Online Library",
    desc: "Discover thousands of books, journals, and learning resources right at your fingertips.",
    learnMore: "Learn More",
    search: "Search",
    bookTypes: "Book Types",
    kazakh: "Kazakh",
    turkish: "Turkish",
    english: "English",
    library: "Our library",
    ourd: "Our library is equipped with new books, study areas, and iMacs. In the online library, you can access and read books conveniently. All conditions have been created for the benefit of students.",
    popular: "Popular Books",
    contact: "Contact us",
    address: "Address",
    puwkina: "Pushkina, 154",
    social: "Social media",
    insta: "Instagram",
    web: "Website"
  },
  ru: {
    home: "Главная",
    myBooks: "Мои книги",
    title: "Онлайн библиотека",
    desc: "Откройте для себя тысячи книг, журналов и учебных ресурсов в одном месте.",
    learnMore: "Узнать больше",
    search: "Поиск",
    bookTypes: "Типы книг",
    kazakh: "Казахский",
    turkish: "Русский",
    english: "Английский",
    library: "Наша библиотека",
    ourd: "Наша библиотека оснащена новыми книгами, учебными зонами и iMac. В онлайн-библиотеке вы можете удобно получить доступ к книгам и читать их. Все условия созданы для пользы студентов.",
    popular: "Популярные книги",
    contact: "Свяжитесь с нами",
    address: "Адрес",
    puwkina: "Пушкина, 154",
    social: "Социальные сети",
    insta: "Инстаграм",
    web: "Веб-сайт"
  },
  kz: {
    home: "Басты бет",
    myBooks: "Менің кітаптарым",
    title: "Онлайн кітапхана",
    desc: "Мыңдаған кітаптарды, журналдарды және оқу ресурстарын оңай табыңыз.",
    learnMore: "Көбірек білу",
    search: "Іздеу",
    bookTypes: "Кітап түрлері",
    kazakh: "Қазақша",
    turkish: "Орысшa",
    english: "Ағылшынша",
    library: "Біздің кітапхана",
    ourd: "Біздің кітапхана жаңа кітаптармен, оқу аймақтарымен және iMac-пен жабдықталған. Онлайн кітапханада сіз кітаптарға қол жеткізіп, ыңғайлы түрде оқи аласыз. Барлық жағдай студенттердің игілігі үшін жасалған.",
    popular: "Танымал кітаптар",
    contact: "Байланыс",
    address: "Мекенжай",
    puwkina: "Пушкин, 154",
    social: "Әлеуметтік желілер",
    insta: "Инстаграм",
    web: "Веб-сайт"
  }
};

function updateTranslations(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

function loadLanguage() {
  const savedLang = localStorage.getItem("lang") || "en";
  document.querySelector(".language-select").value = savedLang;
  updateTranslations(savedLang);
}

document.querySelector(".language-select").addEventListener("change", e => {
  const selectedLang = e.target.value;
  localStorage.setItem("lang", selectedLang);
  updateTranslations(selectedLang);
});

let allBooks = [];

const SHEET_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // replace with your actual script URL

document.addEventListener("DOMContentLoaded", () => {
  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
      allBooks = data;
      displayBooks(allBooks);
    })
    .catch(err => console.error("Error loading books:", err));
  
  document.querySelectorAll(".type-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      const genre = btn.getAttribute("data-genre");
      const filtered = genre === "All" ? allBooks : allBooks.filter(book => book.genre === genre);
      displayBooks(filtered);
    });
  });
});

function displayBooks(books) {
  const container = document.getElementById("searchResults");
  container.innerHTML = "";

  if (!books.length) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  books.forEach(book => {
    const card = document.createElement("div");
    card.style = `
      flex: 0 1 320px;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 15px;
      background: #f9f9f9;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      display: flex;
      gap: 15px;
      align-items: flex-start;
      margin-bottom: 20px;
    `;

    card.innerHTML = `
      <img src="${book.image}" alt="Book Cover" style="height: 140px; width: 100px; object-fit: cover; border-radius: 5px;" />
      <div style="flex-grow: 1;">
        <h2 style="margin: 0 0 10px; font-size: 1.2rem;">${book.title}</h2>
        <p style="margin: 0 0 6px;"><strong>Author:</strong> ${book.author}</p>
        <p style="font-size: 0.9rem; color: #444;">${book.description}</p>
        ${
          book.pdf
            ? `<a href="${book.pdf}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 600;">📄 View PDF</a>`
            : `<p style='color: grey; margin-top: 8px;'>No PDF available.</p>`
        }
      </div>
    `;
    container.appendChild(card);
  });
}

function searchBooks() {
  const query = document.getElementById("bookInput").value.toLowerCase();
  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );
  displayBooks(filtered);
}
