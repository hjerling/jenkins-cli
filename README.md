# jenkins-cli

> Command line interface for Jenkins (BBC)

## Features

* Shows state of latest build
* Shows progress of ongoing build

## Installation

```
npm install -g hjerling/jenkins-cli
```

You then need to export the location of your BBC developer certificate:

```
export COSMOS_CERT=/path/to/my.pem
```

## Usage

_In the following examples, the job `ibl` is used as an example._

To view all commands and full usage information:

```
jenkins -h
```

To view options for a particular command:

```
jenkins build-history -h
```

### Build Information

Get information about most recent build for a job:

```
jenkins build-history ibl -s 1
```

Get information about a specific build for a job:

```
jenkins build-history ibl -n 5
```

Get build history for 10 latest builds for a job:

```
jenkins build-history ibl
```

Get build history for all saved builds for a job:

```
jenkins build-history ibl -a
```

Get output from the most recent build for a job:

```
jenkins build-output ibl
```

Get output from a specific build for a job:

```
jenkins build-output ibl -n 5
```

Monitor progress of a ongoing build for a job:

```
jenkins build-progress ibl
```

### Job Information


Search for a job:

```
jenkins search ibl
```

List all jobs:

```
jenkins search
```

### Job Interactions

Trigger a build for a job:

```
jenkins build ibl
```

## Development

* All interactions with the Jenkins API use the [`node-jenkins`](https://github.com/hjerling/node-jenkins) library.
* The `node-jenkins` library should closely match the Jenkins API.
* If your command needs to make multiple Jenkins requests, make multiple calls into the `node-jenkins` library. Don't add methods to the API library for aggregating calls.
* To use a local version of the `node-jenkins` library during development, clone the library and link it from within the `jenkins-cli` project:

```
git clone git@github.com:hjerling/jenkins-cli.git
git clone git@github.com:hjerling/node-jenkins.git
cd jenkins-cli
npm link ../node-jenkins
```
* To use your local version of `jenkins-cli` in development you can [npm link](https://docs.npmjs.com/cli/link) it globally so that the `jenkins` command will point to your version:

```
cd jenkins-cli
npm link .
```

If you're having any problems with `npm link`, make sure you've upgraded to a shiny new npm first:

```
npm install -g npm
```

## Contributing

1. [Fork it!](https://github.com/hjerling/jenkins-cli/fork)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create new [Pull Request](https://github.com/hjerling/cosmos-cli/pulls).

## Thanks

Thanks to [Robin Murphy](https://github.com/robinjmurphy) for basic structure of app.
