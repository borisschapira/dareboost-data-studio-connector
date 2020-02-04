# Pre Alpha Dareboost Connector for Data Studio

_This is not an official Dareboost product_

This Data Studio Connector aims to give Data Studio users access to Dareboost
data, based on Apps Script.

## Set up the Community Connector for personal use

To use this Community Connector in Data Studio there is a one-time setup to
deploy your own personal instance of the connector using Apps Script.

### Deploy the connector for yourself

1.  Visit [Google Apps Script](https://script.google.com/) and create a new
    project.
1.  In the Apps Script development environment, select **View > Show manifest
    file**. Replace the contents of this file with the content of the
    `src/appsscript.json` file from the repository.
1.  For every `.js` file under `src`, you will need to create a file in Apps
    Scripts (**File > New > Script File**), then copy over the content from the
    repository.
1.  To use the Community Connector in Data Studio, follow the
    [guide on Community Connector Developer site](https://developers.google.com/datastudio/connector/use).

## Using the connector in Data Studio

TODO

## Troubleshooting

### This app isn't verified

When authorizing a community connector, an OAuth consent screen may be presented
to you with a warning "This app isn't verified". This is because the connector
has requested authorization to make requests to an external API (E.g. to fetch
data from the service you're connecting to, like Dareboost). If you have
followed the deployment guide to setup a connector and are using your own
personal deployment you do not need to complete the verification process and
instead can continue past this warning by clicking **Advanced > Go to {Project
Name} (unsafe)**.

For additional details see [OAuth Client Verification][verify].

[verify]: https://developers.google.com/apps-script/guides/client-verification
