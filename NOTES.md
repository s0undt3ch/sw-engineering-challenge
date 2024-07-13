# SW Challenge Notes

## Layout

Figure out what a "normal" layout looks like.
For now, followed the steps in https://noahflk.com/blog/express-api-nodejs-typescript-setup

## Future Question (pre-commit)

Looks like pre-commit and lint-staged do just about the same. Investigate the community standards regarding this matter.

## Something working

Was able to read the provided JSON data and serve it through some pretty dumb endpoints.
In theory, the data was loaded and cast to the right interface. I'll need to verify that.
I'll need to make the controllers more modular, right now it's a single `controller.ts` which will obviously not
scale.
TESTS! I need to figure out tests.

## Decoupling controllers

Each controller now defines it's own router instance which is the only exported object that will, in turn, be used as a
middleware on the main router object.

## Sync vs Async

The approach taken for this task has been the simplest/fastest one.
Obviously, depending on the problem getting solved, and myself knowing more about async support in Node, this might not
be the best approach, but so far, it's one that appears to be getting me closer to a solution to the task.

## Tests

We now have a basic test which only tests the `/` route, not API endpoint tests just yet.

## Found a new How-To

Found a new How-To series that makes it easier to wrap my head around my (un)knowledge of Node+Typescript+Express and my
need for structure and separation of responsibilities:

- https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1

Let's adapt to this one

## Too Much!?

The new How-To does in fact modularize the code, but it might be a lot to explain for this SW task.
Tests run again, though, no API tests yet.

## Mimic the Bloq approach to Lockers and Rents

Used the approach taken with Bloqs to Lockers and Rents.
It also includes basic tests like getting all and one by ID.
Next, relationships.

## First relationship

Our API is now able to list the lockers that belong to a Bloq ID

## Get lockers by status

This approach allow the filtering to happen using the URL which, depending on what we want to support might be too
narrow scoped.
For a broader approach, consider allowing passing a JSON object which would then be used to do the filtering. Each key
would be a field that we would compare values.

## Focus... Enough Play.

While learning new stuff is always awesome, we do have a goal to keep in mind.
WE MUST DELIVER!

## Bloqs controller full(ish) coverage

Added tests for PUT and PATCH for the Bloqs controller, obviously, there's a few more scenarios which would require
tests, like, do we allow Bloq's to change their ID's? And if so, support updating relationships, test it, etc...

## Debatable endpoints

Added support and tests for `/lockers/occupancy/{free,occupied}` endpoints but the endpoints paths is up for
discussion.

## Lockers controller full(ish) coverage

Initial test coverage for all supported HTTP methods in place.

## Another Important Question

Figure out how API versioning is best done in express land.
Using `/vN` URL prefixes or "a la" GitHub with a header...

## Rents controller full(ish) coverage

Initial test coverage for all supported HTTP methods in place.

## After thoughts

There's a lot of room for improvement, and a lot of knowledge to acquire:

- There's no "state machine" enforcing rent status, ie, it should not be possible to go from `DELIVERED` to
  `WAITING_PICKUP`, etc.
- Validating fields is cumbersome right now and you need to implement checks for each field. I'm pretty sure there are
  some really good schema and validation libraries out there.
- There's no API documentation! I'm sure there's also a library which (auto)generates API documentation for us in a
  known and widely adopted format like, ie, OpenAPI.

All in all, I had fun! Thank You!
