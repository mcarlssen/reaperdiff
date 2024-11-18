# NOTES

Since it's impossible to tell the diference between a clip that has been intentionally and unintentionally deleted, it's also impossible to detect when there is overlap on a deleted clip.

_The algorithm assumes that deletions are intentional, and ignores overlaps with deleted clips._

_Currently, the algorithm does NOT ignore muted clips, and treats these like normal clips._


/* ------------------------------------------------------------------------------------------------ */

Feature Requirements for Change Detection in Revised File
1. Parse and Structure .RPP Files

    Objective: Create a function to parse .RPP files and extract the relevant clip data needed for change detection.
    Details:
        Each .RPP file should be parsed to retrieve all <ITEM> blocks representing clips.
        For each clip, extract and store key properties:
            POSITION: Numeric start position on the timeline.
            LENGTH: Numeric duration of the clip.
            OFFSET: Optional offset value (if available in the file).
            NAME: Identifier for the clip (e.g., file name).
            IGUID: Unique identifier for the clip.
        Structure the parsed data as an array of clips, maintaining the timeline order based on the POSITION value.

2. Initialize Cumulative Position Shift

    Objective: Set up a mechanism to track cumulative shifts in clip positions caused by upstream changes (such as insertions or deletions).
    Details:
        Initialize a cumulativeShift variable to 0 at the start of the change detection process.
        This variable will be used to adjust expected positions for downstream clips, helping differentiate true changes from position shifts caused by earlier edits.

3. Sequential Comparison of Clips

    Objective: Compare each clip in the Control file with the corresponding clip in the Revised file to detect differences.
    Details:
        Iterate over clips in the Control file and match each to its counterpart in the Revised file by order.
        For each clip pair, evaluate the following:
            Position Difference: Calculate the absolute difference between the Control clip’s POSITION (adjusted by cumulativeShift) and the Revised clip’s POSITION. Flag as changed if the difference exceeds a small tolerance (e.g., 0.01).
            Length Difference: Check if the LENGTH differs between the Control and Revised clips.
            Offset Difference: Check if the OFFSET (if present) differs between the Control and Revised clips.
            Content Difference: Compare the NAME or IGUID of each clip to detect changes in clip content (e.g., if the audio file has changed).
        If any of the above checks reveal a difference, log the POSITION of the Revised clip as a change.

4. Adjust Cumulative Shift Based on Changes

    Objective: Update the cumulative shift to account for position changes that impact downstream clips.
    Details:
        When a change in LENGTH is detected (e.g., a clip has been extended or shortened), update the cumulative shift by the difference in length:

        cumulativeShift += revisedClip.LENGTH - controlClip.LENGTH;

        This adjustment ensures that downstream clips maintain their relative positions according to any changes introduced by upstream edits.

5. Detect and Flag Overlaps

    Objective: Identify any unintentional overlaps introduced by changes in position or length and differentiate true overlaps from natural shifts.
    Details:
        For each Revised clip, check if its calculated end position overlaps with the start of the next clip.
        If an overlap is found, compare it with the expected cumulative shift to determine:
            True Overlap: Mark as a true overlap if caused by changes in LENGTH, OFFSET, or a misalignment in POSITION.
            Shifted Overlap: Ignore if the overlap is a result of cumulative shifts aligning the timeline without unintended overlaps.

6. Return and Display Detected Changes

    Objective: Provide a list of changed timecodes for further analysis or visualization.
    Details:
        Return a list of timecodes where changes were detected, indicating either an insertion, deletion, or modification.
        Categorize changes for further visualization as follows:
            Red: Clips with content, length, or position changes.
            Green: Unchanged clips.
            Neutral: Clips that shifted due to cumulative changes but didn’t actually change in content or length.