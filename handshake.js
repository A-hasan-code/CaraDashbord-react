<script>
// Parent (Outer site)
    window.addEventListener("message", function(event) {
  // Check if the message is coming from a trusted origin
  if (event.origin !== "https://gallerydashboard.xortlogix.com") {
        console.log("Message from unknown origin:", event.origin);
    return;
  }

    const contactId = event.data.contactId;

    if (contactId) {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const locationId = pathParts[3]; // Adjust based on actual URL structure
    const goHighLevelUrl = `${window.location.origin}/v2/location/${locationId}/contacts/detail/${contactId}`;
    console.log(goHighLevelUrl, "dt");

    // Open the contact page in a new tab
    window.open(goHighLevelUrl, '_blank');
  } else {
        console.log("No contact ID received.");
  }
}, false);
</script>
