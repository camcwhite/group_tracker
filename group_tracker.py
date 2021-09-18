import PySimpleGUI as sg
import calendar
from datetime import datetime, timedelta
import sys
import json
from PySimpleGUI.PySimpleGUI import Button
from jsonschema import validate
from jsonschema.exceptions import ValidationError
import os
from shutil import copyfile
from fpdf import FPDF
# from uuid import uuid4 as new_id

if getattr(sys, 'frozen', False):
    folder_path = os.path.dirname(sys.executable)
else:
    folder_path = str(os.path.dirname(__file__))

DB_FILENAME = os.path.join(folder_path, 'data.json')
DATA = None

DB_SCHEMA = {
    "type": "object",
    "properties": {
        "LAST_SAVED": {"type": "string"},
        "SESSIONS": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "GROUP_NAME": {"type": "string"},
                    # "ID": {"type": "string"},
                    "DATE": {"type": "string"},
                    "DURATION_HOURS": {"type": "number"},
                    "ATTENDEES": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "additionalProperties": False,
                "minProperties": 4,
            }
        }
    }
}

def load_data(second_try=False):
    if second_try:
        raise ValueError('There is an internal error with the data file.')
    global DATA
    try:
        with open(DB_FILENAME, 'r') as f:
            new_data = json.load(f)
            validate(new_data, DB_SCHEMA)
            DATA = new_data
    except (ValidationError, FileNotFoundError) as err:
        print('Error loading data:', err)
        new_file_path = os.path.join(os.path.dirname(DB_FILENAME), 'data_corrupted.json')
        if type(err) is not FileNotFoundError:
            copyfile(DB_FILENAME, new_file_path)
        print('Generating new data.json')
        DATA = {
            "LAST_SAVED": "null",
            "SESSIONS": [],
        }
        save_data()
        load_data(second_try=True)

def save_data():
    '''
    Save DATA to disk at DB_FILENAME
    '''
    DATA["LAST_SAVED"] = datetime.today().strftime('%Y-%m-%d %I:%M %p')
    with open(DB_FILENAME, 'w') as f:
        json.dump(DATA, f, indent=2)

REPORT_TITLE = "River City Advocacy Peer Support Participants Report"

PDF_FONT = {
    'family': 'Arial',
    'size': 10,
}

HOME = 'home'
ADD_SESSION = 'Add Group Session'
EDIT_SESSION = 'Edit Group Sessions'
CREATE_REPORT = 'Create Report'
ABOUT = 'About'
WINDOW_TITLE = 'Group Tracker'


button_options = {
    'size': (20, 2),
    'font': 'arial 20 bold',
    'pad': (50, 10),
}

submit_button_options = {
    'size': (7, 1),
    'font': 'arial 20 bold',
    'pad': 20,
}

header_text_options = {
    # 'size': (20, 5),
    'font': 'arial 25 bold',
    'justification': 'center',
    'pad': 50,
}

label_text_options = {
    'font': 'arial 25',
    'pad': (0, 10),
}

text_input_options = {
    'size': (20, 10),
    'font': 'arial 25',
}

date_input_options = {
    'size': (10, 10),
    'font': 'arial 25',
    'justification': 'right',
}

number_input_options = {
    'size': (3, 10),
    'font': 'arial 25',
    'justification': 'right',
}

ticker_button_options = {
    'font': 'arial 15',
    'pad': 10,
}

text_box_options = {
    'size': (30, 10),
    'font': 'arial 20',
}

error_text_options = {
    'font': 'arial 20',
    'text_color': 'red',
}

def home_window():
    home_layout = [
        [sg.Text('Peer Support Participant Tracker', **header_text_options)],
        [sg.Button(ADD_SESSION, **button_options)],
        [sg.Button(EDIT_SESSION, **button_options)],
        [sg.Button(CREATE_REPORT, **button_options)],
        [sg.Button(ABOUT, **button_options)],
        [sg.Button('Quit', **button_options)],
    ]
    return sg.Window(WINDOW_TITLE, home_layout, finalize=True, return_keyboard_events=True, element_justification='c')

def home_event_processing(window):
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED or event == 'Quit':
            break
        elif event in {ADD_SESSION, EDIT_SESSION, CREATE_REPORT, ABOUT}:
            return event

def last_nonzero_index(inp):
    '''
    Return the index of the last nonzero element in inp plus 1 
    '''
    for i in range(len(inp)-1, -1, -1):
        if inp[i] != 0:
            return i + 1
        
    raise ValueError('All elements are 0')

today_obj = datetime.today()
today = today_obj.strftime('%Y-%m-%d')
last_week = (today_obj - timedelta(weeks=1)).strftime('%Y-%m-%d')

def add_session_window():
    add_session_layout = [
        [sg.Text('Add a Group Session', **header_text_options)],
        [sg.Text('Group Name:', **label_text_options), sg.InputText(key='-GROUP-', **text_input_options)],
        [sg.Text('Date:', **label_text_options), 
            sg.InputText(default_text=today, key='-DATE-', **date_input_options)],
        [sg.Text('Duration (hours):', **label_text_options), 
            sg.Button('-', key='-DURATION_MINUS-', **ticker_button_options), 
            sg.InputText(default_text='1', key='-DURATION-', **number_input_options),
            sg.Button('+', key='-DURATION_PLUS-', **ticker_button_options)],
        [sg.Text('Participants:', **label_text_options), sg.InputText(key='-PARTICIPANT-',**text_input_options)],
        [sg.Multiline(key='-PARTICIPANTS-', **text_input_options)],
        [sg.Text('', key='-ERROR-', visible=False, **error_text_options)],
        [sg.Button('Submit', **submit_button_options), sg.Button('Back', **submit_button_options)],        
    ]
    return sg.Window(WINDOW_TITLE, add_session_layout, finalize=True, return_keyboard_events=True, element_justification='c')

ENTER = 'Return:603979789'

def get_date(date_str):
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.strftime('%Y-%m-%d')
    except ValueError: # invalid date
        return None

def valid_num(num_str):
    try:
        float(num_str)
        return True
    except ValueError:
        return False

def add_session_event_processing(window):
    participants = []
    float_or_zero = lambda s: float(s) if valid_num(s) else 0
    make_int = lambda n: int(n) if int(n) == n else n
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED:
            break
        elif event in ('\r', ENTER):
            new_participant = values['-PARTICIPANT-']
            if new_participant:
                participants.insert(0, new_participant)
                window['-PARTICIPANTS-'].update(value='\n'.join(participants))
                window['-PARTICIPANT-'].update(value='')
        elif event == 'Back':
            return HOME
        elif event == '-DURATION_MINUS-':
            duration = make_int(float_or_zero(values['-DURATION-']))
            window['-DURATION-'].update(value=max(0, duration-1))
        elif event == '-DURATION_PLUS-':
            duration = make_int(float_or_zero(values['-DURATION-']))
            window['-DURATION-'].update(value=duration+1)
        elif event == 'Submit':
            group_name = values['-GROUP-']
            date = get_date(values['-DATE-'])
            duration = values['-DURATION-']
            participants = [val for val in values['-PARTICIPANTS-'].split('\n') if val]
            error = None
            if not group_name:
                error = 'Group Name is empty'
            elif not date:
                error = 'Invalid Date, Please enter in YYYY-MM-DD format'
            elif not duration or not valid_num(duration):
                error = 'Please enter a number (in hours) for Duration'
            elif not participants:
                error = 'No participants entered'
            
            if error:
                window['-ERROR-'].update(visible=True, value=error)
            else:
                # Submit the data
                sessions_list = DATA["SESSIONS"]
                sessions_list.append({
                    "GROUP_NAME": group_name,
                    "DATE": date,
                    "DURATION_HOURS": float(duration),
                    "ATTENDEES": [name.lower() for name in participants]
                })
                save_data()
                # clear form
                for key in ('-GROUP-', '-PARTICIPANT-', '-PARTICIPANTS-'):
                    window[key].update(value='')
                window['-DATE-'].update(value=today)
                window['-DURATION-'].update(value='1')
                participants.clear()
        else:
            window['-ERROR-'].update(visible=False, value='')

def edit_session_event_processing(window):
    participants = []
    float_or_zero = lambda s: float(s) if valid_num(s) else 0
    make_int = lambda n: int(n) if int(n) == n else n
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED:
            break
        elif event in ('\r', ENTER):
            new_participant = values['-PARTICIPANT-']
            if new_participant:
                participants.insert(0, new_participant)
                window['-PARTICIPANTS-'].update(value='\n'.join(participants))
                window['-PARTICIPANT-'].update(value='')
        elif event == 'Back':
            return HOME
        elif event == '-DURATION_MINUS-':
            duration = make_int(float_or_zero(values['-DURATION-']))
            window['-DURATION-'].update(value=max(0, duration-1))
        elif event == '-DURATION_PLUS-':
            duration = make_int(float_or_zero(values['-DURATION-']))
            window['-DURATION-'].update(value=duration+1)
        elif event == 'Submit':
            group_name = values['-GROUP-']
            date = get_date(values['-DATE-'])
            duration = values['-DURATION-']
            participants = [val for val in values['-PARTICIPANTS-'].split('\n') if val]
            error = None
            if not group_name:
                error = 'Group Name is empty'
            elif not date:
                error = 'Invalid Date, Please enter in YYYY-MM-DD format'
            elif not duration or not valid_num(duration):
                error = 'Please enter a number (in hours) for Duration'
            elif not participants:
                error = 'No participants entered'
            
            if error:
                window['-ERROR-'].update(visible=True, value=error)
            else:
                # Submit the data
                sessions_list = DATA["SESSIONS"]
                sessions_list.append({
                    "GROUP_NAME": group_name,
                    "DATE": date,
                    "DURATION_HOURS": float(duration),
                    "ATTENDEES": [name.lower() for name in participants]
                })
                save_data()
                # clear form
                for key in ('-GROUP-', '-PARTICIPANT-', '-PARTICIPANTS-'):
                    window[key].update(value='')
                window['-DATE-'].update(value=today)
                window['-DURATION-'].update(value='1')
                participants.clear()
        else:
            window['-ERROR-'].update(visible=False, value='')

def edit_session_window():
    edit_session_layout = [
        [sg.Button('Prev', **submit_button_options), sg.Text('Edit a Group Session', **header_text_options), sg.Button('Next', **submit_button_options)],
        [sg.Text('Group Name:', **label_text_options), sg.InputText(key='-GROUP-', **text_input_options)],
        [sg.Text('Date:', **label_text_options), 
            sg.InputText(default_text=today, key='-DATE-', **date_input_options)],
        [sg.Text('Duration (hours):', **label_text_options), 
            sg.Button('-', key='-DURATION_MINUS-', **ticker_button_options), 
            sg.InputText(default_text='1', key='-DURATION-', **number_input_options),
            sg.Button('+', key='-DURATION_PLUS-', **ticker_button_options)],
        [sg.Text('Participants:', **label_text_options), sg.InputText(key='-PARTICIPANT-',**text_input_options)],
        [sg.Multiline(key='-PARTICIPANTS-', **text_input_options)],
        [sg.Text('', key='-ERROR-', visible=False, **error_text_options)],
        [sg.Button('Submit', **submit_button_options), sg.Button('Back', **submit_button_options)],        
    ]
    return sg.Window(WINDOW_TITLE, edit_session_layout, finalize=True, return_keyboard_events=True, element_justification='c')
            
def create_report_window():
    create_report_layout = [
        [sg.Text('Generate Report', **header_text_options)],
        [sg.Text('Start Date (YYYY-MM-DD):', **label_text_options)],
        [sg.InputText(key='-START-', default_text=last_week, **text_input_options)],
        [sg.Text('End Date (YYYY-MM-DD):', **label_text_options)],
        [sg.InputText(key='-END-', default_text=today, **text_input_options)],
        [sg.Text('', key='-ERROR-', visible=False, **error_text_options)],
        [sg.FileSaveAs('PDF',initial_folder=folder_path, target="-FILEPATH-", **submit_button_options), sg.FileSaveAs('Text', initial_folder=folder_path, target="-FILEPATH-", **submit_button_options), sg.Button('Back', **submit_button_options)],
        [sg.Input(key='-FILEPATH-', enable_events=True, visible=False)]
    ] 
    return sg.Window(WINDOW_TITLE, create_report_layout, finalize=True, return_keyboard_events=True, element_justification='c')

def date_in(date_str, start, end):
    '''
    Returns true if date is in between start and end
    (date_str assumed to be str in YYYY-MM-DD format)
    (start and end assumed to be datetime objects)
    '''
    date = datetime.strptime(date_str, "%Y-%m-%d")
    return start <= date <= end 

def gen_report(start_str, end_str):
    start = datetime.strptime(start_str, '%Y-%m-%d')
    end = datetime.strptime(end_str, '%Y-%m-%d')
    start_out = start.strftime('%B %d, %Y')
    end_out = end.strftime('%B %d, %Y')
    now_str = datetime.today().strftime('%A, %B %d, %Y at %I:%M %p')
    report = REPORT_TITLE + "\n"
    report += f'Generated on {now_str}\n'
    report += f'Time Period: {start_out} to {end_out}\n'

    num_people = 0

    '''
    groups: Group Names --> {
        SESSIONS: Dates --> Attendees List
        PEOPLE: Set of People served
        TOTAL_ATTENDANCE: Number of total attendees
        TOTAL_HOURS: Number of total hours
    }
    '''
    groups = {}
    people = set()
    total_attendance = 0
    num_sessions = 0
    tot_hours = 0
    for session in DATA["SESSIONS"]:
        date = session['DATE']
        if date_in(date, start, end):
            num_sessions += 1
            group_name = session['GROUP_NAME']
            groups.setdefault(group_name, {})
            group = groups[group_name]

            participants = session['ATTENDEES']
            group.setdefault('PEOPLE', set())
            group['PEOPLE'].update(participants)
            group.setdefault('TOTAL_ATTENDANCE', 0)
            group['TOTAL_ATTENDANCE'] += len(participants)

            group.setdefault('TOTAL_HOURS', 0)
            group['TOTAL_HOURS'] += session['DURATION_HOURS']
            tot_hours += session['DURATION_HOURS']

            total_attendance += len(participants)
            people.update(participants)
            group.setdefault('SESSIONS', {})
            sessions = group['SESSIONS']
            sessions.setdefault(date, [])
            sessions[date].extend(participants)

    num_people = len(people)

    num_groups = len(groups)

    avg_attendance = round(total_attendance / num_sessions, 1) if num_sessions else 'N/A'
    avg_duration = round(tot_hours / num_sessions, 1) if num_sessions else 'N/A'

    report += f'Number of unique people: {num_people}\n'
    report += f'Number of groups: {num_groups}\n'
    report += f'Number of sessions: {num_sessions}\n'
    report += f'Number of total hours: {tot_hours}\n'
    report += f'Average attendance per session: {avg_attendance}\n'
    report += f'Average session duration: {avg_duration} hours\n'

    report += 'Groups:\n'
    for group_name, group_info in groups.items():
        report += f'\t{group_name}:\n'
        report += f'\t\tNumber of unique people: {len(group_info["PEOPLE"])}\n'
        report += f'\t\tNumber of sessions: {len(group_info["SESSIONS"])}\n'
        report += f'\t\tNumber of hours: {group_info["TOTAL_HOURS"]}\n'
        report += f'\t\tAverage attendance per session: {round(group["TOTAL_ATTENDANCE"]/len(sessions), 1)}\n'
        report += f'\t\tAverage session duration: {round(group["TOTAL_HOURS"]/len(sessions), 1)} hours\n'

    return report

def save_pdf(report, path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font(**PDF_FONT)
    lines = report.split('\n')
    pdf.cell(200, 10, txt=lines[0], ln=1, align='C')
    for line in lines[1:]:
        for i in range(len(line)):
            if line[i] != '\t':
                break
            pdf.cell(10)
        pdf.cell(200, 5, txt=line, ln=1)
    if path.endswith('/'):
        path += 'report.pdf'
    if not path.endswith('.pdf'):
        path += '.pdf'
    pdf.output(path)

def save_txt(report, path):
    if not path.endswith('.txt'):
        path += '.txt'
    with open(path, 'w') as f:
        f.write(report)

report_save_funcs = {
    'PDF': save_pdf,
    'Text': save_txt,
}

def create_report_event_processing(window):
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED:
            break
        elif event == 'Back':
            return HOME
        elif event == "-FILEPATH-":
            start = get_date(values['-START-'])
            end = get_date(values['-END-'])
            error = None
            if not start:
                error = 'Start'
            elif not end:
                error = 'End'
            
            if error:
                window['-ERROR-'].update(visible=True, value=f'Invalid {error} date, Please enter in YYYY-MM-DD format')
            else:
                # find the button that was pressed
                _type = None
                for key, val in values.items():
                    if key in report_save_funcs and val:
                        _type = key
                        break
                if _type: # the save was not canceled
                    # generate the report
                    report = gen_report(start, end)
                    report_save_funcs[_type](report, values[_type])
                    return HOME

def about_window():
    about_layout = [
        [sg.Text('About', **header_text_options)],
        [sg.Text('This app was made, with love, for River City Advocacy', **label_text_options)],
        [sg.Text('by Renee and Cameron White', **label_text_options)],
        [sg.Button('Back', **submit_button_options)],
    ] 
    return sg.Window(WINDOW_TITLE, about_layout, finalize=True, return_keyboard_events=True, element_justification='c')

def about_event_processing(window):
    while True:
        event, values = window.read()
        if event == sg.WIN_CLOSED:
            break
        elif event == 'Back':
            return HOME

layouts = {
    HOME: {
        'window': home_window,
        'event_processing': home_event_processing,
    },
    ADD_SESSION: {
        'window': add_session_window,
        'event_processing': add_session_event_processing,
    },
    EDIT_SESSION: {
        'window': edit_session_window,
        'event_processing': edit_session_event_processing,
    },
    CREATE_REPORT: {
        'window': create_report_window,
        'event_processing': create_report_event_processing,
    },
    ABOUT: {
        'window': about_window,
        'event_processing': about_event_processing,
    }
}

if __name__ == '__main__':
    current_layout = HOME
    args = sys.argv
    if 'add-session' in sys.argv:
        current_layout = ADD_SESSION
    if 'edit-session' in sys.argv:
        current_layout = EDIT_SESSION
    elif 'create-report' in sys.argv:
        current_layout = CREATE_REPORT

    load_data()

    # sg.theme('LightGreen3')    
    while True:
        window = layouts[current_layout]['window']()
        window.bring_to_front()

        current_layout = layouts[current_layout]['event_processing'](window) 
        if not current_layout:
            break

        window.close()
