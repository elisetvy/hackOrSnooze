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

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="fave-star">
      <i class="bi-star testing"></i>
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
  console.log('submit success');
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
  $('#add-story-form').hide();
}

// Attach to submit form (on submit event)
$('#story-submit-button').on('click', getAndDisplayStory);

function getAndDisplayFavorite(event) {
  console.log('changestar function called');
  $(event.target).attr("class", "bi-star-fill");
  console.log(event.target);

}

//$(".fave-star").on("click", () => console.log("fave-star class clicked"));
$("#all-stories-list").on("click", ".fave-star", getAndDisplayFavorite);