"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();

  if (currentUser) {
    $(".fave-star").show(); // TODO: refactor? - create a function to show fave stars
  }
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $(".nav-left").show();
  //se span with stars to show?
  $(".fave-star").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  //added below
  $loginForm.hide();
  $signupForm.hide();
}

/** Reveals add new story form. */

function navSubmitClick(evt) {
  evt.preventDefault();
  putStoriesOnPage();
  $('.fave-star').show();
  $('#add-story-form').show()
    .css("display", "block");
}

$('#story-submit-link').on('click', navSubmitClick);


/** Handles Favorites click on nav bar, repopulating story list with only
 * the user's favorited stories */
function navFavoritesClick(evt) {
  evt.preventDefault();
  hidePageComponents();
  $allStoriesList.empty();
 /*  console.log('newFavoritesClick executing'); */

  if (currentUser.favorites.length === 0) {
    $allStoriesList.append('<p>No favorites added!</p>');
  }

  for (let story of currentUser.favorites) {
    /* console.log('building new storyList from user faves'); */
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $(".fave-star").show();
  $allStoriesList.show();
}

$('#user-favorites').on('click', navFavoritesClick);