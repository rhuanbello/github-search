const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('button');
const repositoryContainer = document.querySelector('.repositories-container');
const profileContainer = document.querySelector('section')

const getUserData = (username) => {
  fetch(`https://api.github.com/users/${username}`)
    .then((response) => response.json())
    .then((userData) => {
      getUserRepos(userData, username)
    })
    .catch((error) => {

    })
}

const getUserRepos = (userData, username) => {
  fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    .then((response) => response.json())
    .then((repositories) => {
      handleUserGitHubData(userData, repositories)
    })
    .catch((error) => {
      
    })
}

const handleUserGitHubData = ({
  name,
  avatar_url,
  location,
  bio,
  login,
  followers,
  created_at
}, repositories) => {

  const filteredRepos = repositories.map(({ stargazers_count, homepage, name, description, language }) => ({
    stargazers_count,
    homepage,
    name,
    description,
    language
  }));

  const filteredUserData = {
    name,
    avatar_url,
    location,
    bio,
    login,
    followers,
    created_at,
    reposAmount: filteredRepos.length

  }

  const sortedReposByStars = filteredRepos.sort((a, b) => (
    b.stargazers_count - a.stargazers_count
  ))

  renderRepositories(sortedReposByStars);
  renderProfileData(filteredUserData);
}

const handleFormatName = (name) => {
  const formatedText = name?.replaceAll('-', ' ')
    .replaceAll('_', ' ')
    ?.split(' ')
    ?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
    ?.join(' ')
    ?.trim();
  return handleReduceText(formatedText, 15);
}

const handleReduceText = (text, maxLength) => {
  const substringedText = text?.length > maxLength ? text?.substring(0, maxLength) : text;
  return substringedText;
}

const renderRepositories = (repository) => {

  repository.forEach(project => {
    const { stargazers_count, homepage, name, description, language } = project;

    repositoryContainer.innerHTML += `
      <li class="repository-card">
          <div class="repository-header">
            <p>${handleFormatName(name)}</p>
          </div>
          <div class="repository-info">
            <span>${language}</span>
            <div>
              <i class="ri-star-line"></i>
              <span>${stargazers_count}</span>
            </div>
          </div>
          <p>${handleReduceText(description, 60) || `${name} desenvolvido por Rhuan Bello`}</p>
          ${homepage ? `<a class="repository-action" href="${homepage}" target="_blank">Acessar</a>` : ''}
        </li>
    `;
  })

}

const renderProfileData = ({
  name,
  avatar_url,
  location,
  bio,
  login,
  followers,
  created_at,
  reposAmount
}) => {

  profileContainer.innerHTML += `
      <div class="profile-container">
      <img src="${avatar_url}" alt="">
      <div class="profile-info">
        <h3>${name}</h3>
        <span>@${login}</span>
        <p>${bio}</p>
        <div class="profile-extra-info">
          <div>
            <i class="ri-map-pin-line"></i>
            <span>${location}</span>
          </div>
          <div>
            <i class="ri-calendar-event-line"></i>
            <span>Ingressou em ${new Date(created_at).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-data">
      <div>
        <span>${reposAmount}</span>
        <p>Repositórios</p>
      </div>
      <div>
        <span>${followers}</span>
        <p>Seguidores</p>
      </div>
    </div>
  `
}

const validateInput = (input) => {
  const inputValidated = input.toLowerCase().trim();
  resetContainers();
  getUserData(inputValidated)
}

const resetContainers = () => {
  repositoryContainer.innerHTML = '';
  profileContainer.innerHTML = '';
}

searchButton.addEventListener('click', () => validateInput(searchInput.value));
window.addEventListener('keypress', e => e.code === 'Enter' && validateInput(searchInput.value))