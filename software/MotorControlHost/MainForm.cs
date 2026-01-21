using System;
using System.Drawing;
using System.Windows.Forms;

namespace MotorControlHost;

public sealed class MainForm : Form
{
    public MainForm()
    {
        Text = "Motor Control";
        StartPosition = FormStartPosition.CenterScreen;
        ClientSize = new Size(360, 160);

        var startButton = new Button
        {
            Name = "StartButton",
            Text = "Start",
            Size = new Size(120, 40),
            Location = new Point(40, 60),
        };

        var stopButton = new Button
        {
            Name = "StopButton",
            Text = "Stop",
            Size = new Size(120, 40),
            Location = new Point(200, 60),
        };

        Controls.Add(startButton);
        Controls.Add(stopButton);
    }
}
