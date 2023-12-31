"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let iconClass = "bi-star bi-star-fill";

  if (currentUser) {
    if (currentUser.isInFavorites(story.storyId)) {
      iconClass = "bi-star-fill";
    }
  }



  //check if story is in favs array. if yes, icon class is bi-star-fill
  //if not, icon class is bi-star
  //I think we should check by storyId, (func on bottom of page)

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="fave-star" style="display: none">
      <i class="${iconClass} star-icon"></i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Get form data
// Call addStory
// Put new story on page

/**
 * A function that takes text data from a form, uses it in an API
 * request by calling addStory, calls generateStoryMarkup,
 * and then appends the resulting element to the DOM.
 */
async function getAndDisplayStory(event) {
  event.preventDefault();
  const storyAuthor = $('#story-form-author').val(); //just values, not jquery objects
  const storyTitle = $('#story-form-title').val();
  const storyURL = $('#story-form-url').val();

  $('#story-form-author').val('');
  $('#story-form-title').val('');
  $('#story-form-url').val('');

  const newStory = {
    author: storyAuthor,
    title: storyTitle,
    url: storyURL
  };

  const story = await storyList.addStory(currentUser, newStory); // returns Story instance
  const storyMarkup = generateStoryMarkup(story);
  $('#all-stories-list').prepend(storyMarkup);
  $('.fave-star').show();
  $('#add-story-form').hide();
}

// Attach to submit form (on submit event)
$('#story-submit-button').on('click', getAndDisplayStory);

/** Handles the addition or deletion of favorites, triggered by the
 * user clicking on the star next to a story.
 */
async function handleFaveStarClick(event) {

  const favStoryId = $(event.target).closest("li").attr("id");

  $(event.target).toggleClass("bi-star");

  const clickedStoryData = await Story.getStoryInstance(favStoryId);

  const clickedStory = new Story(clickedStoryData.story);

  if (currentUser.isInFavorites(favStoryId)) {
    currentUser.deleteFavorite(clickedStory);
  } else {
    currentUser.addFavorite(clickedStory);
  }

}

$("#all-stories-list").on("click", ".star-icon", handleFaveStarClick);