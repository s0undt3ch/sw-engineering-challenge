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
