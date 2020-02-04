var cc = DataStudioApp.createCommunityConnector();
var apiVersion = '0.6';

// https://developers.google.com/datastudio/connector/reference#isadminuser
function isAdminUser() {
  return false;
}

// https://developers.google.com/datastudio/connector/reference#getconfig
function getConfig(request) {
  var config = cc.getConfig();

  config
    .newInfo()
    .setId('instructions')
    .setText('Please insert your API Key and choose the data you want to get');

  config
    .newTextInput()
    .setId('apiKey')
    .setName('Your API key')
    .setHelpText("Plus d'infos sur https://www.dareboost.com/fr/profile/api")
    .setPlaceholder('9SD9FDS8FDS8DCX8V8CXV4');

  config
    .newSelectSingle()
    .setId('route')
    .setName('Data to retrieve')
    .setHelpText('Choose the data you want to retrieve')
    .addOption(
      config
        .newOptionBuilder()
        .setLabel('monitoring/list')
        .setValue('monitoring/list')
    );

  return config.build();
}

function getFields(request) {
  var fields = cc.getFields();
  var types = cc.FieldType;

  fields
    .newDimension()
    .setId('tracking_id')
    .setName('Identifier')
    .setType(types.NUMBER);

  fields
    .newMetric()
    .setId('tracking_name')
    .setName('Name')
    .setType(types.TEXT);

  fields
    .newMetric()
    .setId('tracking_url')
    .setName('URL')
    .setType(types.URL);

  return fields;
}

// https://developers.google.com/datastudio/connector/reference#getschema
function getSchema(request) {
  var fields = getFields(request).build();
  return { schema: fields };
}

// https://developers.google.com/datastudio/connector/reference#getdata
function getData(request) {
  // Create schema for requested fields
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields().forIds(requestedFieldIds);
  var parsedResponse, rowsResponse;

  try {
    parsedResponse = getMonitoringList(
      request.configParams.apiKey,
      request.configParams.route
    );
  } catch (e) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText('Error fetching data from API. Exception details: ' + e)
      .setText(
        'There was an error communicating with the service. Try again later, or file an issue if this error persists.'
      )
      .throwException();
  }

  try {
    rowsResponse = responseToRows(requestedFields, parsedResponse);
  } catch (e) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText(
        'Error transforming data from API into rows. Exception details: ' + e
      )
      .setText(
        'There was an error during the date manipulation. Try again later, or file an issue if this error persists.'
      )
      .throwException();
  }

  return {
    schema: requestedFields.build(),
    rows: rowsResponse
  };
}

function getMonitoringList(apiKey, route) {
  var fetchOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ token: apiKey })
  };

  var jsondata = UrlFetchApp.fetch(
    'https://www.dareboost.com/api/' + apiVersion + '/' + route,
    fetchOptions
  );
  return JSON.parse(jsondata).monitorings;
}

function responseToRows(requestedFields, response) {
  // Transform parsed data and filter for requested fields
  return response.map(function(monitoring) {
    var row = [];
    requestedFields.asArray().forEach(function(field) {
      switch (field.getId()) {
        case 'tracking_id':
          return row.push(monitoring.id);
        case 'tracking_name':
          return row.push(monitoring.name);
        case 'tracking_url':
          return row.push(monitoring.url);
        default:
          return row.push('');
      }
    });
    return { values: row };
  });
}
