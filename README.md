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
jenkins build-info -h
```
### Build

Get information about most recent build for a job:

```
jenkins build-info ibl
```

Get information about a specific build for a job:

```
jenkins build-info -n 5 ibl
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
jenkins build-output -n 5 ibl
```

Monitor progress of a ongoing build for a job:

```
jenkins build-progress ibl
```

## Contributing

1. [Fork it!](https://github.com/hjerling/jenkins-cli/fork)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create new [Pull Request](https://github.com/hjerling/cosmos-cli/pulls).
