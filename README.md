# jenkins-cli

> Command line interface for Jenkins

## Features

* Shows state of latest build
* Shows progress of ongoing build

## Installation

```
npm install -g hjerling/jenkins-cli
```

You then set the Jenkins host URL with this:

```
jenkins config -H https://builds.apache.org/
```

For certificate configurations see the [configuration section](https://github.com/hjerling/jenkins-cli#configuration).

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

Search among jobs that are currently building:

```
jenkins search ibl -b
```

List all jobs:

```
jenkins search
```

List all jobs currently building:

```
jenkins search -b
```

### Build Queue

Show the build queue:

```
jenkins build-queue
```

### Job Interactions

Trigger a build for a job:

```
jenkins build ibl
```

Request for the latest build of a job to stopped:

```
jenkins stop-build ibl
```

Request for a specific build of a job to stopped:

```
jenkins stop-build ibl 5
```
### Configuration

Configuration is stored in the file `~/.jenkins`.
The object in the file is passed on to the [`request.defaults`](https://github.com/request/request) function so it is possible to to utilise that if need be.

Set the Jenkins host URL:

```
jenkins config --host http://jenkins.url
```

Set the Jenkins host communication certificate:

```
jenkins config --cert /path/to/certtificate
```

Set the certificate password:

```
jenkins config --certPassword c3r71f1c473-p455w0rd
```

### Jenkins Server

Show information about the Jenkins Build Server:

```
jenkins info
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
