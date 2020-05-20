# List of valid move characters
VALID_CHARS = "LRF"
# List of valid file name characters
VALID_FILE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-. "


def valid_filename(file_to_validate):
    # No file passed. Already checked that file is passed on client side.
    # if not file_to_validate:
    #     return False

    # File name length check
    if len(file_to_validate.filename) > 250:
        return False

    # Check if file name contains only valid file name characters
    for letter in file_to_validate.filename:
        if letter not in list(VALID_FILE_CHARS):
            return False

    # Check that file name has a maximum of one period
    file_name_split = file_to_validate.filename.split(".")
    if len(file_name_split) > 2:
        return False

    # Check that the file extension is txt
    if file_name_split[1].lower() != "txt":
        return False

    return True


def get_data(value):
    try:
        # Read data directly from temporary file
        raw_data = value.read()
        clean_data = ""

        # Take characters from the input file if they represent a
        # valid move (L, R, F) and add them to clean_data (IN UPPERCASE)
        for char in raw_data:
            letter_caps = chr(char).upper()

            if letter_caps in list(VALID_CHARS):
                clean_data += letter_caps

    except IOError:
        return "ERROR: An error occurred while processing the data."

    # After processing, return a cleaned version of the data as a string
    return clean_data
